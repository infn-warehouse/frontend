import enums from "@/enums";
import helper from "@/mixins/helper";

export default {
  mixins: [helper],
  computed: {
    enums() {
      return enums;
    }
  },
  data() {
    return {
      item: null,
      loading: false,
    }
  },
  async created() {
    await this._fetch();
  },
  methods: {
    async _fetch() {
      this.loading=true;
      let res=await this.operationWithCheck(async () => await this.fetch());
      this.loading=false;
      if (res) {
        this.item=res;
      }
    },
    handleCancel() {
      this.item={...this.item};
    }
  },
}