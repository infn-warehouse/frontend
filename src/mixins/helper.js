import { mapMutations } from "vuex";
import enums from "@/enums";
import GraphileService from "@/services/graphile.service";
import ApiService from "@/services/api.service";
import _ from "lodash";
import { FillService } from "@/services/fill.service";

export default {
  mixins: [],
  computed: {
    enums() {
      return enums;
    }
  },
  data: function() {
    return {
      options: {
        html: false, // set to true if your message contains HTML tags. eg: "Delete <b>Foo</b> ?"
        loader: false, // set to true if you want the dailog to show a loader after click on "proceed"
        reverse: false, // switch the button positions (left to right, and vise versa)
        okText: this.$t("confirm.yes"),
        cancelText: this.$t("confirm.no"),
        animation: 'zoom', // Available: "zoom", "bounce", "fade"
        type: 'basic', // coming soon: 'soft', 'hard'
        verification: 'continue', // for hard confirm, user will be prompted to type this to enable the proceed button
        verificationHelp: 'Type "[+:verification]" below to confirm', // Verification help text. [+:verification] will be matched with 'options.verification' (i.e 'Type "continue" below to confirm')
        clicksCount: 3, // for soft confirm, user will be asked to click on "proceed" btn 3 times before actually proceeding
        backdropClose: false, // set to true to close the dialog when clicking outside of the dialog window, i.e. click landing on the mask
        customClass: '' // Custom class to be injected into the parent node for the current dialog instance
      }
    };
  },
  methods: {
    ...mapMutations("snackbar", ["showMessage","closeMessage"]),

    showError(code,extra=null) {
      this.showMessage({
        context: enums.TOAST_TYPE.ERROR,
        text: this.$t("errors."+code,{extra})
      });
    },

    checkResult(res,evaluate=null) {
      if (res.error) {
        if (res.error.jwtExpired) {
          this.$router.push({ name: "Login" }).catch(()=>{});
          return null;
        }

        if (evaluate) {
          let temp=evaluate(res.error);
          if (temp) {
            if (typeof temp === 'object')
              this.showError(temp.code,temp.extra);
            else
              this.showError(temp);
            return null;
          }
        }
        
        if (res.error instanceof Error)
          this.showMessage({
            context: enums.TOAST_TYPE.ERROR,
            text: res.error+this.$t("errors.GENERIC")
          });
        else
          this.showMessage({
            context: enums.TOAST_TYPE.ERROR,
            text: JSON.stringify(res.error)+this.$t("errors.GENERIC")
          });
        return null;
      }
      else {
        return res;
      }
    },
    async operationWithCheck(func,evaluate=null) {
      try {
        return this.checkResult(await func(),evaluate);
      }
      catch (error) {
        return this.checkResult({error},evaluate);
      }
    },
    makeTitle(resourceTitle,mode,name) {
      let title="";
      switch (mode) {
        case enums.FORM_MODE.CREATE:
          title = this.$t("misc.createResource", {
            resourceType: resourceTitle || "-"
          });
          break;
        case enums.FORM_MODE.UPDATE:
          title = this.$t("misc.updateResource", {
            resourceType: resourceTitle || "-",
            resourceName: name || "-"
          });
          break;
        default:
          break;
      }
      return title;
    },
    makeTitleDetails(type,name) {
      return this.$t("misc.detailResource", {
        resourceType: type,
        resourceName: name
      });
    },
    async createOrUpdateHelper(
      mode,
      resName,
      resType,
      idName,
      payload,
      payloadOld,
      currentId,
      createdName,
      updatedName,
      extra = null
    ) {
      console.log("createOrUpdateHelper");
      let pcopy = _.cloneDeep(payload);
      for (let key in pcopy) {
        if (pcopy[key]==null || pcopy[key]==="")
          if (mode == enums.FORM_MODE.CREATE || payloadOld[key]==null || payloadOld[key]==="")
            delete pcopy[key];
          else pcopy[key]=null;
      }

      let res;

      if (mode == enums.FORM_MODE.CREATE)
        res=await this.operationWithCheck(async () => await GraphileService.create(resType,pcopy,idName));
      else
        res=await this.operationWithCheck(async () => await GraphileService.update(resType,pcopy,idName,currentId));

      if (res) {
        if (extra) {
          let extra_res = await extra(res);
          if (extra_res) {
            this.showMessage({
              context: enums.TOAST_TYPE.ERROR,
              text: "Error: " + extra_res
            });
            return null;
          }
        }
        if (mode == enums.FORM_MODE.CREATE) {
          this.showMessage({
            context: enums.TOAST_TYPE.SUCCESS,
            text:  this.$i18n.t("toasts.created") +
              " " +
              resName +
              " " +
              createdName({ v: res ? res.data : {}, p: pcopy })
          });
          return res;
        } else {
          this.showMessage({
            context: enums.TOAST_TYPE.SUCCESS,
            text: this.$i18n.t("toasts.updated") +
              " " +
              resName +
              " " +
              updatedName({ v: res ? res.data : {}, p: pcopy })
          });
          return res;
        }
      }
      return null;
    },
    async deleteConfirm(resName, resType, resOrig, idName, payload, deletedName) {
      return new Promise((resolve) => {
        this.$dialog
        .confirm(this.$t("confirm.deleteMessage"),this.options)
        .then(async function(dialog) {
          resolve(await this.deleteHelper(resName, resType, resOrig, idName, payload, deletedName));
        })
        .catch(async function() {
          resolve(false);
        });
      });
    },
    async deleteHelper(resName, resType, resOrig, idName, payload, deletedName) {
      let pcopy = _.cloneDeep(payload);
      const res = await this.operationWithCheck(async () => await GraphileService.delete(resType,resOrig,payload[idName],idName));
      if (res) {
        this.showMessage({
          context: enums.TOAST_TYPE.SUCCESS,
          text: this.$i18n.t("toasts.deleted") +
            " " +
            resName +
            " " +
            deletedName({ v: res ? res.data : {}, p: pcopy })
        });
        return true;
      }
    },
    async getPref(name) {
      let res=await this.operationWithCheck(async () => await ApiService.get("prefs/"+name));
      if (res)
        return res.data;
      return null;
    },
    async setPref(name,value) {
      let res=await this.operationWithCheck(async () => await ApiService.put("prefs/"+name,value,
        {
          headers: { 'Content-Type': 'text/plain' }
        }
      ));

      if (res)
        return true;
      return false;
    },
    mobile(value) {
      if (this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs)
        return 12;
      return value;
    },
    mobile2(value) {
      if (this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.md)
        return 12;
      return value;
    },
    checkMobile() {
      return (this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs);
    },

    async fillModuleAndOpen(template,payload,joinFileds,dataTypes) {
      let data=await FillService.fill(template,payload,joinFileds,dataTypes);
      var file = new Blob([data], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
}
