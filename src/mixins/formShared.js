import enums from "@/enums";
import _ from "lodash";
import helper from "@/mixins/helper";
import utils from "../utils";

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
      reason: "",
      saved: false
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
    op: {
      type: Object,
      required: false
    },
    subIndex: {
      type: Number,
      required: false
    },
  },
  methods: {
    async onSubmit() {
      let res=await this._submitToStore(true);
      if (res) {
        this.saved=true;
        this.$emit("formClose");
      }
    },
    async _submitToStore(next) {
      this.loading=true;
      let res=await this.submitToStore(this.showReason ? this.reason : null,this.op,this.subIndex);
      this.loading=false;

      if (res) {
        let id=utils.extractId(this.idName,res.data);
        this.form={...this.form, id};

        this.$emit("formSucceed",{
          ...this.form,
          "_id": this.form.id
        },next);

        return true;
      }
      return false;
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
        this.currentId=utils.extractId(this.idName,this.selectedItem);
        utils.updateObject(newForm,this.selectedItem);
      }

      if (this.model)
        newForm[this.modelField]=this.model;

      this.form=newForm;
      this.formOld=_.cloneDeep(newForm);
    },
    save: _.debounce(async function() {
      if (this.saved) return;
      let res=this.saveOpHelper(this.op,this.subIndex,this.form);
      if (res)
        this.saved=true;
    }, process.env.VUE_APP_SAVE_TIME),
    handleEdit() {
      if (!this.op) return;
      this.saved=false;
      this.save();
    }
  },
  created() {
    this.setForm();
    this.setTitle();
    if (this.mode==enums.FORM_MODE.CREATE && this.computeEmpty)
      this.computeEmpty();

    if (this.op) {
      if (this.op.savedData[this.subIndex]) {
        utils.updateObject(this.form,this.op.savedData[this.subIndex]);
      }
      // else if (this.mode==enums.FORM_MODE.CREATE) {
      //   console.log("- create -");
      //   this._submitToStore(false);
      // }
      // else {
      //   console.log("- progress -");
      //   this.progressOpHelper(this.op,this.subIndex,{
      //     type: this.mode,
      //     payload: this.form
      //   },this.form);
      // }
    }
  },
}