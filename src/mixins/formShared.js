import enums from "@/enums";
import _ from "lodash";
import helper from "@/mixins/helper";

export default {
  mixins: [helper],

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
      loading: false,
      form: {},
      formOld: {},
      reason: ""
    };
  },
  props: {
    mode: {
      default: enums.FORM_MODE.CREATE,
      type: String
    },
    selectedItem: Object,
    model: {
      type: String,
      required: false
    },
    locked: {
      type: Boolean,
      required: false
    },
    hideTitle: {
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
    },
    showReason: {
      type: Boolean,
      required: false
    },
  },
  methods: {
    async onSubmit() {
      this.loading=true;
      let res=await this.submitToStore();
      this.loading=false;

      if (res) {
        if (this.showReason) {
          await this.registerOp(this.resourceTypes,this.mode,"§reason: "+this.reason,"complete");
        }

        this.form[this.idName]=res.data[this.idName];
        this.$emit("formSucceed",{
          ...this.form,
          "_id": this.form[this.idName]
        });
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
      let newForm=_.cloneDeep(this.emptyForm);
      
      if (this.selectedItem) {
        this.currentId=this.selectedItem[this.idName];
        for (let key in this.selectedItem)
          if (key in newForm)
            newForm[key]=this.selectedItem[key];
      }

      if (this.model)
        newForm[this.modelField]=this.model;

      this.form=newForm;
      this.formOld=_.cloneDeep(newForm);
    },
  },
  created() {
    this.setForm();
    this.setTitle();
    if (this.mode==enums.FORM_MODE.CREATE && this.computeEmpty)
      this.computeEmpty();
  },
}