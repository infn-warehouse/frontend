import { mapMutations } from "vuex";
import enums from "@/enums";
import GraphileService from "@/services/graphile.service";
import ApiService from "@/services/api.service";
import _ from "lodash";

export default {
  mixins: [],
  computed: {
    enums() {
      return enums;
    }
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
      createdName,
      updatedName,
      extra = null
    ) {
      let pcopy = _.cloneDeep(payload);
      for (let key in pcopy) {
        if (pcopy[key]==null || pcopy[key]=="")
          delete pcopy[key];
      }

      const res=await this.operationWithCheck(async () => await GraphileService.createOrUpdate(resType,pcopy,idName));
      if (res) {
        if (extra) {
          let extra_res = await extra(res);
          if (extra_res) {
            this.showMessage({
              context: enums.TOAST_TYPE.ERROR,
              text: "Error: " + extra_res
            });
            return false;
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
          return true;
        } else {
          this.showMessage({
            context: enums.TOAST_TYPE.SUCCESS,
            text: this.$i18n.t("toasts.updated") +
              " " +
              resName +
              " " +
              updatedName({ v: res ? res.data : {}, p: pcopy })
          });
          return true;
        }
      }
    },
    async deleteConfirm(resName, resType, resOrig, idName, payload, deletedName) {
      return new Promise((resolve) => {
        this.$confirm({
          message:
            this.$t("confirm.deleteMessage"),
          button: {
            no: this.$t("confirm.no"),
            yes: this.$t("confirm.yes")
          },
          callback: async confirm => {
            if (confirm)
              resolve(await this.deleteHelper(resName, resType, resOrig, idName, payload, deletedName));
            else resolve(false);
          }
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
  }
}