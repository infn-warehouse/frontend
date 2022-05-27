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
    hasBack: {
      type: Boolean,
      required: false
    },
  },
  methods: {
    async onSubmit() {
      this.loading=true;
      await this.submitToStore();
      this.loading=false;
      this.$emit("formSucceed");
      this.$emit("formClose");
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
  },
}