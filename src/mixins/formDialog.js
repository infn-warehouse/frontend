import enums from "@/enums";

export default {
  computed: {
    enums() {
      return enums;
    }
  },
  data() {
    return {
      formDialog: [false,false,false],
      mode: [null,null,null],
      editItem: [null,null,null]
    }
  },
  methods: {
    openCreate(i) {
      this.mode[i]=enums.FORM_MODE.CREATE;
      this.editItem[i]=null;
      this.formDialog[i]=true;
      this.dialogUpdate();
    },
    openUpdate(i,item) {
      this.mode[i]=enums.FORM_MODE.UPDATE;
      this.editItem[i]=item;
      this.formDialog[i]=true;
      this.dialogUpdate();
    },
    closeDialog(i) {
      this.formDialog[i]=false;
      this.dialogUpdate();
    },
    dialogUpdate() {
      this.formDialog=[...this.formDialog];
      this.mode=[...this.mode];
      this.editItem=[...this.editItem];
    }
  }
}