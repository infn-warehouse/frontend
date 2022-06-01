import enums from "@/enums";
import _ from "lodash";

export default {
  computed: {
    enums() {
      return enums;
    },
  },
  watch: {
    selectedItem() {
      this.setForm();
      this.setTitle();
    },
  },
  data() {
    return {
      loading: false
    };
  },
  props: {
    mode: {
      default: enums.FORM_MODE.CREATE,
      type: String
    },
    selectedItem: Object,
    modelId: {
      type: String,
      required: false
    },
    locked: {
      type: Boolean,
      required: false
    },
    multiForm: {
      type: Boolean,
      required: false
    },
    multiLayout: {
      type: Number,
      required: false
    }
  },
  methods: {
    async onSubmit() {
      this.loading=true;
      let res=await this.submitToStore();
      this.loading=false;

      if (res) {
        this.$emit("formSucceed",this.form);
        this.$emit("formClose");
      }
    },
    async onCancel() {
      this.$emit("formCancel");
      this.$emit("formClose");
    },
    async onBack() {
      this.$emit("formBack");
    },
    setForm() {
      this.form=_.cloneDeep(this.emptyForm);
      if (this.selectedItem) {
        this.currentId=this.selectedItem[this.idName];
        for (let key in this.selectedItem)
          if (key in this.form)
            this.form[key]=this.selectedItem[key];
      }
    },
  },
  created() {
    this.setForm();
    this.setTitle();
  },
}