import { mapMutations } from "vuex";
import enums from "@/enums";
import { DevourService } from "@/services/devour.service";
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

    operationWithCheck(res) {
      if (res.error) {
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: res.error
        });
        return null;
      }
      else {
        return res;
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
      payload,
      createdName,
      updatedName,
      extra = null
    ) {
      let pcopy = _.cloneDeep(payload);
      try {
        const res = await DevourService.createOrUpdate(resType,payload);
        if (res && res.error) {
          this.showMessage({
            context: enums.TOAST_TYPE.ERROR,
            text: "Error: " + JSON.stringify(res.error)
          });
          return false;
        }
        if (extra) {
          let extra_res = await extra(res);
          if (extra_res) {
            this.showMessage({
              context: enums.TOAST_TYPE.ERROR,
              text: "Error: " + JSON.stringify(extra_res)
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
      } catch (error) {
        console.log(error);
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: "Error: " + error
        });        
        return false;
      }
    },
    async deleteConfirm(resName, resType, payload, deletedName) {
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
              resolve(await this.deleteHelper(resName, resType, payload, deletedName));
            else resolve(false);
          }
        });
      });
    },
    async deleteHelper(resName, resType, payload, deletedName) {
      let pcopy = _.cloneDeep(payload);
      try {
        const res = await DevourService.delete(resType,payload.id);
        if (res && res.error) {
          this.showMessage({
            context: enums.TOAST_TYPE.ERROR,
            text: "Error: " + JSON.stringify(res.error)
          });
          return false;
        }
        this.showMessage({
          context: enums.TOAST_TYPE.SUCCESS,
          text: this.$i18n.t("toasts.deleted") +
            " " +
            resName +
            " " +
            deletedName({ v: res ? res.data : {}, p: pcopy })
        });
        return true;
      } catch (error) {
        console.log(error);
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: "Error: " + error
        });
        return false;
      }
    }
  }
}