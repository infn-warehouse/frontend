import enums from "@/enums";

export default {
  computed: {
    enums() {
      return enums;
    }
  },
  data() {
    return {
      formDialog: false,
      mode: null,
      editItem: null
    }
  },
  methods: {
    openCreate() {
      this.mode=enums.FORM_MODE.CREATE;
      this.formDialog=true;
    },
    openUpdate(item) {
      console.log("OPENUPDATE")
      this.mode=enums.FORM_MODE.UPDATE;
      this.editItem=item;
      this.formDialog=true;
    },
    close() {
      this.formDialog=false;
    }
  }
}