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
      loading: 0,
    }
  },
  async created() {
    await this._fetch();
  },
  methods: {
    async _fetch() {
      this.loading++;
      let res=this.operationWithCheck(await this.fetch(this.editing_id));
      this.loading--;
      if (res) {
        this.item=res;
      }
    },
    handleCancel() {
      this.item={...this.item};
    }
  },
}