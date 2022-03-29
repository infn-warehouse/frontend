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
      loading: 0,
      search: "",
      filter: null,
      allClear: true,
      paginationOpts: {
        page: 1,
        itemsPerPage: 25,
        sortDesc: [false],
        multiSort: false,
        mustSort: true
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
    if (this.immutableFilter && this.immutableFilterField)
      this.tableData.headers.splice(this.getFieldIndex(this.immutableFilterField),1);
    if (this.noFilter)
      await this._fetch();
  },
  methods: {
    async _fetch() {
      // filter
      let filter={...this.filter};
      if (this.immutableFilter && this.immutableFilterField)
        filter[this.immutableFilterField]={value: this.immutableFilter};
      
      // fields
      let fields=filter.fields;
      delete filter.fields;

      // items
      this.loading++;
      let res=this.operationWithCheck(await this.fetch(this.paginationOpts,this.search,filter));
      this.loading--;
      if (res) {
        this.tableData.headers2=_.cloneDeep(this.tableData.headers);
        if (fields) {
          for (let i=this.tableData.headers2.length-1;i>=0;i--) {
            let item=this.tableData.headers2[i];
            if (!fields.value.includes(item.value))
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
  }
}