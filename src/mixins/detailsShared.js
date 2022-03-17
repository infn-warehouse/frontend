import helper from "@/mixins/helper";

export default {
  mixins: [helper],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeTab: null,
      selectedItem: null,
      detailsTitle: ""
    }
  },
  methods: {
    syncUrl() {
      window.location.hash = this.activeTab+1;
    },
    async handleDelete() {
      if (await this.delete(this.selectedItem)) {
        this.$router.push({ name: this.home });
      }
    },
    async _fetch() {
      let res=this.operationWithCheck(await this.fetch(this.id));
      if (res) {
        this.selectedItem=res;
        this.detailsTitle=this.title(this.selectedItem);
      }
    },
  },
  created() {
    if (window.location.hash.includes("#")) {
      let splt=window.location.hash.split("#");
      let myIndex=splt[splt.length-1];
      this.activeTab = parseInt(myIndex)-1;
    }
    this._fetch();
  }
}