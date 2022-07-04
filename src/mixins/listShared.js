import enums from "@/enums";
import helper from "@/mixins/helper";
import _ from "lodash";

export default {
  mixins: [helper],
  computed: {
    enums() {
      return enums;
    }
  },
  data() {
    return {
      tableData: { headers: [], items: [], headers2: [], items2: [] },
      items: [],
      total: 0,
      loadingCount: 0,
      loading: true,
      
      search: "",
      filter: null,
      allClear: true,
      paginationOpts: {
        page: 1,
        itemsPerPage: 25,
        sortDesc: [false],
      },
      drawer_flag: false,
    }
  },
  props: {
    immutableFilter: {
      required: false
    },
  },
  async created() {
    this.paginationOpts = {...this.paginationOpts, ...this.mergeOpts };
    this.tableData.headers=this.mapHeaders();
    if (this.immutableFilter && this.immutableFilterField) {
      let i=this.getFieldIndex(this.immutableFilterField);
      if (i>=0) this.tableData.headers[i].hidden=true;
    }
    if (this.noFilter)
      await this._fetch();
  },
  methods: {
    async _fetch() {
      // filter
      let filter={...this.filter};
      if (this.immutableFilter && this.immutableFilterField)
        filter[this.immutableFilterField]={value: this.immutableFilter};
      
      // columns
      let columns=[];
      for (let i=0;i<4;i++) {
        if (filter[`columns${i}`])
          columns=[...columns,...filter[`columns${i}`].value];
        delete filter[`columns${i}`];
      }

      // items and headers
      this.loadingCount++;
      this.loading=true;
      let res=await this.operationWithCheck(async () => await this.fetch(this.paginationOpts,this.search,filter));
      this.loadingCount--;
      if (this.loadingCount==0)
        this.loading=false;
        
      if (res) {
        this.tableData.headers2=_.cloneDeep(this.tableData.headers);
        if (columns.length>0) {
          for (let i=this.tableData.headers2.length-1;i>=0;i--) {
            let item=this.tableData.headers2[i];
            if (item.hidden || !columns.includes(item.value))
              this.tableData.headers2.splice(i, 1);
          }
        }

        [this.items,this.total]=res;
        this.tableData.items=this.mapItems();
        this.tableData.items2=_.cloneDeep(this.tableData.items);
        for (let item of this.tableData.items2) {
          for (let key of Object.keys(item.fields)) {
            if (this.getFieldIndex2(key)==-1)
              delete item.fields[key];
          }
        }
      }
    },
    getFieldIndex(name) {
      return _.findIndex(this.tableData.headers,{value:name});
    },
    getFieldIndex2(name) {
      return _.findIndex(this.tableData.headers2,{value:name});
    },
    inject(val) {
      this.paginationOpts = {...this.paginationOpts, ...val };
    },
    handleSearch(text) {
      this.inject({
        page: 1
      });
      this.search=text;
      this._fetch();
    },
    handleChange(clear,filters) {
      this.filter=filters;
      this.allClear=clear;
      this._fetch();
    },
    handleFilterChange(clear,filters) {
      this.inject({
        page: 1
      });
      this.handleChange(clear,filters);
    },
    async handleDelete(item) {
      if (await this.delete(item))
        this._fetch();
    },
    handlePaginationChanged(paginationOpts) {
      this.paginationOpts=paginationOpts;
      this._fetch();
    },
    handleDrawer(val) {
      this.drawer_flag = val;
    },
    refresh() {
      this._fetch();
    }
  }
}