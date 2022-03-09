import Vue from 'vue'
import ApiService from "./api.service";

const GraphileService = {
  types: null,
  assoc: null,
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
  localToGraphileApiPagination(paginationOpts,search,filter) {
    return {
      page: {
        page: paginationOpts.page,
        pageSize: paginationOpts.itemsPerPage
      },
      sort: paginationOpts.sortBy[0],
      sortDir: paginationOpts.sortDesc[0] ? "DESC" : "ASC",
      search: search?search:"",
      filter: filter?filter:""
    };
  },
  async fetchInfo() {
    if (this.types && this.assoc) return;

    try {
      let res=await this.sendQuery(`
      {
        __schema {
          types {
            name
            fields {
              name
              description
            }
          }
        }
      }
      `);
      if (res && res.error) {
        console.log("fetchTypes error from server: ", JSON.stringify(res.error));
        return;
      }

      this.types=[];
      this.assoc=[];
      let temp=res.data.__schema.types;
      temp.forEach(el => {
        if (el.fields) {
          this.types[el.name]=el.fields.filter(x => !x.description || (
            !x.description.includes("that is related to") && !x.description.includes("through a set of")
          )).map(x => x.name);
          this.assoc[el.name]=el.fields.filter(x => !x.description || x.description.includes("that is related to")).map(x => x.name);
        }
      });
    } catch (error) {
      console.log("fetchTypes error: ", error);
    }
  },
  async getFields(type) {
    await this.fetchInfo();
    if (!this.types) return "";

    type=type.charAt(0).toUpperCase() + type.slice(1);
    if (!this.types[type]) return "";
    let out=this.types[type].join("\n");
    return out;
  },
  async getAssoc(type,includes) {
    await this.fetchInfo();
    if (!this.assoc) return "";

    if (!this.assoc[type]) return "";

    let res="";
    for (const include of includes) {
      let temp=this.assoc[type].filter(x => x.startsWith(include));
      if (temp.length>0) {
        res+=`
        ${temp[0]} {
          ${await this.getFields(include)}
        }
        `;
      }
    }

    return res;
  },
  fieldToEnum(field,sortDir) {
    let s=field.substring(1).replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
    s=field.substring(0,1).toUpperCase()+s.toUpperCase();
    return s;
  },
  async fetchOne(type,include,id) {
    try {
      let res=await this.sendQuery(`
      {
        all${type}s(condition: {idMovimento: ${id}}) {
            nodes {
              ${await this.getFields(type)}
              ${await this.getAssoc(type,include)}
            }
        }
      }
      `);
      if (res && res.error) {
        console.log("fetchOne error from server: ", JSON.stringify(res.error));
        return {error: res.error};
      }
      return res.data[`all${type}s`].nodes[0];
    } catch (error) {
      console.log("fetchOne error: ", error);
      return { error };
    }
  },
  async fetchAll(type,include,paginationOpts,search,filter) {
    let searchFilterPagination=this.localToGraphileApiPagination(paginationOpts,search,filter);
    searchFilterPagination.include = include;
    try {
      let res=await this.sendQuery(`
      {
        all${type}s(
          first:${searchFilterPagination.page.pageSize}
          offset:${(searchFilterPagination.page.page-1)*searchFilterPagination.page.pageSize}
          orderBy:${this.fieldToEnum(searchFilterPagination.sort)+"_"+searchFilterPagination.sortDir}) {
            totalCount
            nodes {
              ${await this.getFields(type)}
              ${await this.getAssoc(type,include)}
            }
        }
      }
      `);
      if (res && res.error) {
        console.log("fetchAll error from server: ", JSON.stringify(res.error));
        return {error: res.error};
      }
      let nodes=res.data[`all${type}s`].nodes;
      let count=res.data[`all${type}s`].totalCount;
      return [nodes,count];
    } catch (error) {
      console.log("fetchAll error: ", error);
      return { error };
    }
  },
  async createOrUpdate(type,payload) {
    try {
      let res;
      if (payload.id == "" || !payload.id)
        res=await Vue.$jsonApi.create(type, payload);
      else
        res=await Vue.$jsonApi.update(type, payload);
      if (res && res.error) {
        console.log("createOrUpdate error from server: ", JSON.stringify(res.error));
        return {error: res.error};
      }
      return res;
    } catch (error) {
      console.log("createOrUpdate error: ", error);
      return { error };
    }
  },
  async delete(type,id) {
    if (id == null)
      return null;
    try {
      let res = await Vue.$jsonApi.destroy(type, id);
      if (res && res.error) {
        console.log("delete error from server: ", JSON.stringify(res.error));
        return {error: res.error};
      }
      return res;
    } catch (error) {
      console.log("delete error: ", error);
      return { error };
    }
  }
};

export default GraphileService;
