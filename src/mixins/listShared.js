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
      tableData: { headers: [], items: [] },
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
    if (this.noFilter)
      await this._fetch();
  },
  methods: {
    async _fetch() {
      let filter={...this.filter};
      if (this.immutableFilter && this.immutableFilterField)
        filter[this.immutableFilterField]={value: this.immutableFilter};

      this.loading++;
      let res=this.operationWithCheck(await this.fetch(this.paginationOpts,this.search,filter));
      this.loading--;
      if (res) {
        [this.items,this.total]=res;
        this.tableData.items=this.mapItems();
      }
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