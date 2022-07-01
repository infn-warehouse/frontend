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
      this.$router.replace({path: this.$route.path + '#' + (this.activeTab+1)});
    },
    async handleDelete() {
      if (await this.delete(this.selectedItem)) {
        this.$router.push({ name: this.home });
      }
    },
    async _fetch() {
      let res=await this.operationWithCheck(async () => await this.fetch());
      if (res) {
        this.selectedItem=res;
        this.detailsTitle=this.title(this.selectedItem);
        if (this.handleUpdate) this.handleUpdate();
      }
    },
    handleSucceed(form,sub=null) {
      if (sub==null)
        this.selectedItem={...this.selectedItem,...form};
      else {
        this.selectedItem[sub]={...this.selectedItem[sub],...form};
        this.selectedItem={...this.selectedItem};
      }
      
      if (sub==null) this.detailsTitle=this.title(this.selectedItem);
      if (this.handleUpdate) this.handleUpdate();

      if (sub==null && form._id!=this.id) {
        this.$router.replace({
          name: this.name,
          params: { id: form._id.toString() }
        }).catch(()=>{});
        
        this.syncUrl();
      }
    }
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