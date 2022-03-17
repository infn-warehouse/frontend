import Vue from 'vue'
import ApiService from "./api.service";
import utils from "../utils";

const GraphileService = {
  // variables used for GraphQL introspection
  types: null,
  assoc: null,
  dataTypes: null,

  // try to perform a query by sending it to GraphQL endpoint
  // return the error object if it fails
  async sendQuery(query) {
    const requestData = {
      url: "graphql",
      method: "post",
      data: { query }
    };
    try {
      const response = await ApiService.customRequest(requestData);
      if (response.data.errors)
        return {error: response.data.errors};
      return response.data;
    } catch (error) {
      return {error};
    }
  },

  // do introspection query on GraphQL
  // retrieve informamtion about types and related fields
  async fetchInfo() {
    if (this.types && this.assoc && this.dataTypes) return;

    try {
      let res=await this.sendQuery(`
      {
        __schema {
          types {
            name
            fields {
              name
              description
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
      `);
      if (res && res.error) {
        console.log("fetchTypes error from server: ", res.error);
        return;
      }

      this.types=[];
      this.assoc=[];
      this.dataTypes=[];
      
      let temp=res.data.__schema.types;
      temp.forEach(el => {
        if (el.fields) {
          // dataTypes will be an array of objects, with a single index representing the type
          // for each object, there will be a property for each field:
          //   key: field name, value: a string representing the data type of that field
          this.dataTypes[el.name] = {};
          el.fields.filter(x => !x.description || (
            !x.description.includes("that is related to") && !x.description.includes("through a set of")
          )).forEach(o => {
            this.dataTypes[el.name][o.name] = o.type.name ? o.type.name : o.type.ofType.name;
          });

          // types it will be an array of strings, with two indexes representing type and field
          // the array will not include relations
          this.types[el.name]=el.fields.filter(x => !x.description || (
            !x.description.includes("that is related to") && !x.description.includes("through a set of")
          )).map(x => x.name);

          // assoc will be an array of strings, with two indexes representing type and field
          // the array will include relations
          this.assoc[el.name]=el.fields.filter(x => !x.description || x.description.includes("that is related to")).map(x => x.name);
        }
      });
      console.log(this.types);
    } catch (error) {
      console.log("fetchTypes error: ", error);
    }
  },

  // join the fields of the specified type with line feeds
  // it automatically does introspection
  async joinFields(type) {
    await this.fetchInfo();
    if (!this.types) return "";

    type=type.charAt(0).toUpperCase() + type.slice(1);
    if (!this.types[type]) return "";
    let out=this.types[type].join("\n");
    return out;
  },

  // join the specified relations of the specified type with line feeds
  // it uses the joinFields function to select all the fields for every relation
  async joinAssoc(type,includes) {
    let res="";
    for (const include of includes) {
      let temp=await this.getAssoc(type,include);
      if (temp) {
        res+=`
        ${temp} {
          ${await this.joinFields(include)}
        }
        `;
      }
    }

    return res;
  },

  // format payload for createOrUpdate GraphQL query
  // it allows to discard the id field (if specified)
  async formatPayload(type,payload,idName=null) {
    let res="";
    for (let key in payload) {
      if (key==idName) continue;
      let value=payload[key];
      res+=key+":"+await this.formatSingle(type,key,value)+"\n";
    }
    return res;
  },

  // helper function to get data types
  // it does introspection
  async getDataType(type,field) {
    await this.fetchInfo();
    if (!this.dataTypes) return "";

    return this.dataTypes[utils.firstToUpper(type)][field];
  },

  // helper function to get relations
  // it does introspection
  async getAssoc(type,include) {
    await this.fetchInfo();
    if (!this.assoc) return null;

    if (!this.assoc[type]) return null;

    let temp=this.assoc[type].filter(x => x.startsWith(include));
    if (temp.length>0) {
      return temp[0];
    }
    return null;
  },

  // convert a list of fields to a list of ordering enums that will be used in GraphQL to order query results
  makeOrderList(list,sortDesc,accents) {
    let tempList=[];
    for (let i=0;i<list.length;i++) {
      tempList.push(this.fieldToEnum(list[i],sortDesc[i],accents.includes(list[i])));
    }
    return "["+tempList.join(",")+"]";
  },

  // convert a field name to the ordering enum
  fieldToEnum(field,sortDesc,accent) {
    let s=accent?field.substring(0,field.length-1):field;
    s=utils.firstToUpper(s).replace(/([a-z])([A-Z])/g, function (match,p1,p2){return p1+"_"+p2});
    s+="_"+(sortDesc?"DESC":"ASC");
    return s.toUpperCase();
  },

  // add quotes to the item if it's required
  // retrieve data type
  async formatSingle(type,field,value) {
    let dataType=await this.getDataType(type,field);
    if (dataType!="Int")
      return "\""+value+"\"";
    return value;
  },

  // join a list with commas
  // add quotes to the items if required
  // if it is not a list, pass it to formatSingle function
  // retrieve data type
  async formatList(type,field,list) {
    if (!Array.isArray(list))
      return await this.formatSingle(type,field,list);

    let dataType=await this.getDataType(type,field);
    if (dataType!="Int")
      return "\""+list.join("\",\"")+"\"";
    return list.join(",");
  },

  // create the filter that will used in the GraphQL query
  async createFilter(type,filter,search) {
    let filterExists=false;
    let searchExists=false;

    let filterString="";
    let searchString="";

    // add properties for the filters
    if (filter) {
      for (let key in filter) {
        let item = filter[key];
        // check filter type
        if (item.type=="range") {
          filterString+=key+": {";
          filterString+=`greaterThanOrEqualTo: "${item.value.from}"`;
          filterString+="\n";
          filterString+=`lessThanOrEqualTo: "${item.value.to}"`;
          filterString+="}";
          filterExists=true;
        }
        else {
          if (item.value.length==0) continue;
          filterString+=key+": {";
          filterString+=`in: [${await this.formatList(type,key,item.value)}]`;
          filterString+="}";
          filterExists=true;
        }
      }
    }
    // add properties for the search string
    if (search && search.search && search.search!="") {
      searchString="or: [";
      // loop for all the fields where the search will be done
      for (let o of search.on) {
        // if a field includes the dot, it's not a field of the queried table, but of an another object linked by a relation
        if (o.includes(".")) {
          let oTemp=o.split(".");
          
          let dataType=await this.getDataType(oTemp[0],oTemp[1]);
          if (dataType=="Int" && isNaN(search.search)) continue;
          searchString+="{";
          searchString+=await this.getAssoc(type,oTemp[0])+": {"+oTemp[1]+": {";
          // filter changes according to the data type
          searchString+=`${dataType=="Int"?"equalTo":"includesInsensitive"}: ${await this.formatSingle(oTemp[0],oTemp[1],search.search)}`;
          searchString+="}}";
          searchString+="}";
        }
        else {
          let dataType=await this.getDataType(type,o);
          if (dataType=="Int" && isNaN(search.search)) continue;
          searchString+="{";
          searchString+=o+": {";
          // filter changes according to the data type
          searchString+=`${dataType=="Int"?"equalTo":"includesInsensitive"}: ${await this.formatSingle(type,o,search.search)}`;
          searchString+="}";
          searchString+="}";
        }
        searchExists=true;
      }
      searchString+="]";
    }

    if (!filterExists && !searchExists)
      return "";
    
    let s="filter: {";
    if (filterExists) s+=filterString;
    if (searchExists) s+=searchString;
    s+="}";
    return s;
  },

  async fetchOne(type,include,id,idName) {
    console.log("------- fetchOne");
    type=utils.makeSingular(type);

    try {
      // make the GraphQL query
      let name=`all${utils.makePlural(type)}`;
      let res=await this.sendQuery(`
      {
        ${name} (condition: {${idName}: ${await this.formatSingle(type,idName,id)}}) {
            nodes {
              ${await this.joinFields(type)}
              ${await this.joinAssoc(type,include)}
            }
        }
      }
      `);
      if (res && res.error) {
        console.log("fetchOne error from server: ", res.error);
        return {error: res.error};
      }
      return res.data[name].nodes[0];
    } catch (error) {
      console.log("fetchOne error: ", error);
      return { error };
    }
  },

  async fetchAll(type,include,accents,filter,search,paginationOpts) {
    console.log("------- fetchAll");
    console.log(filter);
    type=utils.makeSingular(type);

    try {
      // make the GraphQL query
      // first and offset properties are related to pagination
      // use the createFilter function for making the filter object
      // retrieve the total count of the records in the queried table
      let name=`all${utils.makePlural(type)}`;
      let res=await this.sendQuery(`
      {
        ${name} (
          first:${paginationOpts.itemsPerPage}
          offset:${(paginationOpts.page-1)*paginationOpts.itemsPerPage}
          orderBy:${this.makeOrderList(paginationOpts.sortBy,paginationOpts.sortDesc,accents)}
          ${await this.createFilter(type,filter,search)}
          ) {
            totalCount
            nodes {
              ${await this.joinFields(type)}
              ${await this.joinAssoc(type,include)}
            }
        }
      }
      `);
      if (res && res.error) {
        console.log("fetchAll error from server: ", res.error);
        return {error: res.error};
      }
      let nodes=res.data[name].nodes;
      let count=res.data[name].totalCount;
      return [nodes,count];
    } catch (error) {
      console.log("fetchAll error: ", error);
      return { error };
    }
  },

  async createOrUpdate(type,payload,idName) {
    try {
      let res;
      let op;
      console.log(payload);
      if (payload[idName] == "" || !payload[idName]) {
        // make create query
        op=`create${type}`;
        res=await this.sendQuery(`
          mutation{${op} (input:{${utils.firstToLower(type)}:{
            ${await this.formatPayload(type,payload)}
          }}){
            ${utils.firstToLower(type)} {
              ${idName}
            }
          }}
        `);
      }
      else {
        // make update query
        op=`update${type}By${utils.firstToUpper(idName)}`;
        res=await this.sendQuery(`
          mutation{${op} (input: {${idName}: ${await this.formatSingle(type,idName,payload[idName])} ${utils.firstToLower(type)}Patch:{
            ${await this.formatPayload(type,payload,idName)}
          }}){
            ${utils.firstToLower(type)} {
              ${idName}
            }
          }}
        `);
      }
      if (res && res.error) {
        console.log("createOrUpdate error from server: ", res.error);
        return {error: res.error};
      }
      console.log(res);
      return {data: res.data[op][utils.firstToLower(type)]};
    } catch (error) {
      console.log("createOrUpdate error: ", error);
      return { error };
    }
  },

  async delete(type,originalType,id,idName) {
    if (id == null)
      return null;
    try {
      // make delete query
      let op=`delete${type}By${utils.firstToUpper(idName)}`;
      let res=await this.sendQuery(`
        mutation{${op} (input: {${idName}: ${await this.formatSingle(type,idName,id)}}) {
          deleted${originalType}Id
        }}
      `);
      if (res && res.error) {
        console.log("delete error from server: ", res.error);
        return {error: res.error};
      }
      return {data: res.data[op]};
    } catch (error) {
      console.log("delete error: ", error);
      return { error };
    }
  }
};

export default GraphileService;
