import enums from "@/enums";

export default {
  computed: {
    enums() {
      return enums;
    },
  },
  watch: {
    selectedItem() {
      this.setForm();
    },
    mode() {
      this.setTitle();
    }
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
    withModelId: {
      type: String,
      required: false
    },
    withModelType: {
      type: String,
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
  },
  created() {
    this.setForm();
    this.setTitle();
  },
}