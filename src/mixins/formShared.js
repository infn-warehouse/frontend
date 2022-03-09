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
  },
  methods: {
    async onSubmit() {
      await this.submitToStore();
      this.$emit("formSucceed");
      this.$emit("formClose");
    },
    async onCancel() {
      this.$emit("formCancel");
      this.$emit("formClose");
    },
  },
  created() {
    this.setForm();
  },
}