import Vue from 'vue'

const DevourService = {
  localToJsonApiPagination(paginationOpts,search,filter) {
    let _sort=paginationOpts.sortBy[0];
    if (!paginationOpts.sortDesc[0])
      _sort=`-${_sort}`;

    return {
      page: {
        page: paginationOpts.page,
        pageSize: paginationOpts.itemsPerPage
      },
      sort: _sort,
      search: search?search:"",
      filter: filter?filter:""
    };
  },
  async fetchOne(type,include,id) {
    try {
      let res = await Vue.$jsonApi.find(type,id,{
        include: include
      });
      if (res && res.error) {
        console.log("fetchOne error from server: ", JSON.stringify(res.error));
        return {error: res.error};
      }
      return res.data[0];
    } catch (error) {
      console.log("fetchOne error: ", error);
      return { error };
    }
  },
  async fetchAll(type,include,paginationOpts,search,filter) {
    let searchFilterPagination=this.localToJsonApiPagination(paginationOpts,search,filter);
    searchFilterPagination.include = include;
    try {
      let res = await Vue.$jsonApi.findAll(type,searchFilterPagination);
      if (res && res.error) {
        console.log("fetchAll error from server: ", JSON.stringify(res.error));
        return {error: res.error};
      }
      return [res.data,res.meta.pagination.rowCount];
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

export { DevourService };
