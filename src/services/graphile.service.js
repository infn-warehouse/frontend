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
    const response = await ApiService.customRequest(requestData);
    if (response.data.errors)
      return {error: response.data.errors};
    return response.data;
  },

  // do introspection query on GraphQL
  // retrieve informamtion about types and related fields
  async fetchInfo() {
    if (this.types && this.assoc && this.dataTypes) return;

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

    this.types={};
    this.assoc={};
    this.dataTypes={};
    
    let temp=res.data.__schema.types;
    temp.forEach(el => {
      if (el.fields) {
        // dataTypes will be a dictionary of objects, with the key representing the type
        // for each object, there will be a property for each field:
        //   key: field name, value: a string representing the data type of that field
        this.dataTypes[el.name] = {};
        el.fields.filter(x => !x.description || (
          !x.description.includes("that is related to") && !x.description.includes("through a set of")
        )).forEach(o => {
          this.dataTypes[el.name][o.name] = o.type.name ? o.type.name : o.type.ofType.name;
        });

        // types will be a dictionary of arrays, with the key representing the type
        // each array will contain the fields (as strings)
        // the arrays will not include relations
        this.types[el.name]=el.fields.filter(x => !x.description || (
          !x.description.includes("that is related to") && !x.description.includes("through a set of")
        )).map(x => x.name);

        // assoc will be a dictionary of arrays, with the key representing the type
        // each array will contain the fields (as strings)
        // the arrays will include relations
        this.assoc[el.name]=el.fields.filter(x => !x.description || x.description.includes("that is related to")).map(x => x.name);
      }
    });
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
    if (value!=null && dataType!="Int" && dataType!="Float" && dataType!="Boolean")
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
    if (dataType!="Int" && dataType!="Float" && dataType!="Boolean")
      return "\""+list.join("\",\"")+"\"";
    return list.join(",");
  },

  // make the filter that will used in the GraphQL query
  async makeFilter(type,filter,search) {
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
          searchString+=`${dataType=="Int"?"equalTo":"likeInsensitive"}: ${await this.formatSingle(oTemp[0],oTemp[1],search.search)}`;
          searchString+="}}";
          searchString+="}";
        }
        else {
          let dataType=await this.getDataType(type,o);
          if (dataType=="Int" && isNaN(search.search)) continue;
          searchString+="{";
          searchString+=o+": {";
          // filter changes according to the data type
          searchString+=`${dataType=="Int"?"equalTo":"likeInsensitive"}: ${await this.formatSingle(type,o,search.search)}`;
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

  async makeCondition(type,id,idName) {
    let s="";
    for (let i=0;i<id.length;i++) {
      s+=`${idName[i]}: ${await this.formatSingle(type,idName[i],id[i])}`;
    }
    return s;
  },

  makeBy(idName) {
    let s="By"+utils.firstToUpper(idName[0]);
    for (let i=1;i<idName.length;i++) {
      s+=`And${utils.firstToUpper(idName[i])}`;
    }
    return s;
  },

  async fetchOne(type,include,id,idName) {
    console.log("< fetchOne on "+type+" >");
    console.log("id:",id);
    console.log(" ");

    // turn id into array
    if (!Array.isArray(idName)) {
      id=[id];
      idName=[idName];
    }

    type=utils.makeSingular(type);

    // run the GraphQL query
    let name=`all${utils.makePlural(type)}`;
    let res=await this.sendQuery(`
      {
        ${name} (condition: {${await this.makeCondition(type,id,idName)}}) {
            nodes {
              ${await this.joinFields(type)}
              ${await this.joinAssoc(type,include)}
            }
        }
      }
    `);

    // check result
    if (res && res.error) {
      console.log("fetchOne error from server: ", res.error);
      return {error: res.error};
    }
    return res.data[name].nodes[0];
  },

  async fetchAll(type,include,accents,filter=null,search=null,paginationOpts=null) {
    console.log("< fetchAll on "+type+" >");
    console.log("filter:",filter);
    console.log("search:",search);
    console.log(" ");

    type=utils.makeSingular(type);

    // run the GraphQL query
    // first and offset properties are related to pagination
    // use the makeFilter function for making the filter object
    // retrieve the total count of the records in the queried table
    let name=`all${utils.makePlural(type)}`;
    let res=await this.sendQuery(`
      {
        ${name} (
          ${paginationOpts ? `
            first:${paginationOpts.itemsPerPage}
            offset:${(paginationOpts.page-1)*paginationOpts.itemsPerPage}
            orderBy:${this.makeOrderList(paginationOpts.sortBy,paginationOpts.sortDesc,accents)}
          ` : ""}
          ${await this.makeFilter(type,filter,search)}
          ) {
            totalCount
            nodes {
              ${await this.joinFields(type)}
              ${await this.joinAssoc(type,include)}
            }
        }
      }
    `);

    // check result
    if (res && res.error) {
      console.log("fetchAll error from server: ", res.error);
      return {error: res.error};
    }
    let nodes=res.data[name].nodes;
    let count=res.data[name].totalCount;
    return [nodes,count];
  },

  async _create(type,payload,idName) {
    // make create query
    let op=`create${type}`;
    return {
      query: `
        ${op} (input:{${utils.firstToLower(type)}:{
          ${await this.formatPayload(type,payload)}
        }}){
          ${utils.firstToLower(type)} {
            ${idName}
          }
        }
      `,
      op: op
    };
  },

  async _update(type,payload,idName,currentId) {
    // turn id into array
    if (!Array.isArray(idName)) {
      currentId=[currentId];
      idName=[idName];
    }

    // make update query
    let op=`update${type}${this.makeBy(idName)}`;
    return {
      query: `
        ${op} (input: {${await this.makeCondition(type,currentId,idName)} ${utils.firstToLower(type)}Patch:{
          ${await this.formatPayload(type,payload)}
        }}){
          ${utils.firstToLower(type)} {
            ${idName}
          }
        }
      `,
      op: op
    };
  },

  async _delete(type,originalType,payload,idName) {
    // get id from payload
    let id=[];
    for (let i=0;i<idName.length;i++)
      id.push(payload[idName[i]]);

    // make delete query
    let op=`delete${type}${this.makeBy(idName)}`;
    return {
      query: `
        ${op} (input: {${await this.makeCondition(type,id,idName)}}) {
          deleted${originalType}Id
        }
      `,
      op: op
    };
  },

  _mutation(a) {
    let s="mutation {";
    a.forEach(o => {
      s+=o.query;
    });
    s+="}";

    return s;
  },

  async create(type,payload,idName) {
    let { query, op }=await this._create(type,payload,idName);
    let res=await this.sendQuery(this._mutation([{ query, op }]));
    if (res && res.error) {
      console.log("create error from server: ", res.error);
      return {error: res.error};
    }
    return {data: res.data[op][utils.firstToLower(type)]};
  },

  async update(type,payload,idName,currentId) {
    let { query, op }=await this._update(type,payload,idName,currentId);
    let res=await this.sendQuery(this._mutation([{ query, op }]));
    if (res && res.error) {
      console.log("update error from server: ", res.error);
      return {error: res.error};
    }
    return {data: res.data[op][utils.firstToLower(type)]};
  },

  async delete(type,originalType,payload,idName) {
    let { query, op }=await this._delete(type,originalType,payload,idName);
    let res=await this.sendQuery(this._mutation([{ query, op }]));
    if (res && res.error) {
      console.log("delete error from server: ", res.error);
      return {error: res.error};
    }
    return {data: res.data[op]};
  },

  async replace(type,payload,idName) {
    await this.delete(type,type,payload,idName);
    return await this.create(type,payload,idName);
  },

  async mutation(a) {
    let res=await this.sendQuery(this._mutation(a));
    if (res && res.error) {
      console.log("delete error from server: ", res.error);
      return {error: res.error};
    }
    return res;
  }
};

export default GraphileService;
