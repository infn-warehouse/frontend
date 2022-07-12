import { mapMutations } from "vuex";
import enums from "@/enums";
import GraphileService from "@/services/graphile.service";
import ApiService from "@/services/api.service";
import _ from "lodash";
import { FillService } from "@/services/fill.service";
import utils from "../utils";
import { v4 as uuidv4 } from 'uuid';

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

    showError(code,extra=null,append=null) {
      this.showMessage({
        context: enums.TOAST_TYPE.ERROR,
        text: this.$t("errors."+code,{extra})+(append ? "<br>"+append : "")
      });
    },

    stringifyError(error) {
      if (error instanceof Error)
        return error+this.$t("errors.GENERIC");
      return JSON.stringify(error)+this.$t("errors.GENERIC")
    },

    checkResult(res,evaluate=null) {
      if (!res) return null;
      if (res.error) {
        console.log(res.error);
        if (res.error.stack)
          console.log(res.error.stack);

        if (res.error.jwtExpired) {
          this.$router.push({ name: "Login" }).catch(()=>{});
          return null;
        }

        if (evaluate) {
          let temp;
          if (typeof evaluate === 'function')
            temp=evaluate(res.error);
          else temp=evaluate;

          if (temp) {
            if (typeof temp === 'object')
              this.showError(temp.code,temp.extra,temp.stringify ? this.stringifyError(res.error) : null);
            else
              this.showError(temp);
            return null;
          }
        }
        
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: this.stringifyError(res.error)
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
      reason,
      op,
      subIndex,
      mode,
      resName,
      typeName,
      resType,
      idName,
      payload,
      payloadOld,
      currentId,
      createdName,
      updatedName,
      extra = null
    ) {
      let pcopy = _.cloneDeep(payload);
      for (let key in pcopy) {
        if (pcopy[key]==null || pcopy[key]==="")
          if (mode == enums.FORM_MODE.CREATE || payloadOld==null || payloadOld[key]==null || payloadOld[key]==="")
            delete pcopy[key];
          else pcopy[key]=null;
      }

      let res;

      if (reason!=null) {
        if (mode == enums.FORM_MODE.CREATE)
          res=await this.operationWithCheck(async () => await GraphileService.mutation([
            await GraphileService._create(resType,pcopy,idName),
            await this.makeRegisterOp(typeName,mode,"§reason: "+reason,"complete")
          ]));
        else
          res=await this.operationWithCheck(async () => await GraphileService.mutation([
            await GraphileService._update(resType,pcopy,idName,currentId),
            await this.makeRegisterOp(typeName,mode,"§reason: "+reason,"complete")
          ]));
      }
      else if (op!=null) {
        // create
        if (mode == enums.FORM_MODE.CREATE) {
          res=await this.operationWithCheck(async () => await GraphileService.mutation([
            await GraphileService._create(resType,{
              ...pcopy,
              draft: op.draft
            },idName),
            await this.makeProgressOp(op,subIndex,{
              type: mode,
            },pcopy)
          ]));
        }
        // update of a draft record
        else if (pcopy.draft) {
          res=await this.operationWithCheck(async () => await GraphileService.mutation([
            await GraphileService._update(resType,pcopy,idName,currentId),
            await this.makeProgressOp(op,subIndex,{
              type: enums.OP_TYPE.CREATE,
            },pcopy)
          ]));
        }
        // update of an existing record
        else {
          res=await this.operationWithCheck(async () => await GraphileService.mutation([
            await this.makeProgressOp(op,subIndex,{
              type: mode,
              payload: pcopy,
              resType,
              idName,
              currentId,
            },pcopy)
          ]));
        }
      }
      else {
        if (mode == enums.FORM_MODE.CREATE)
          res=await this.operationWithCheck(async () => await GraphileService.create(resType,pcopy,idName));
        else
          res=await this.operationWithCheck(async () => await GraphileService.update(resType,pcopy,idName,currentId));
      }

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
        if (op!=null)
          return res;
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
    async deleteConfirm(op,subIndex,resName, resType, resOrig, idName, payload, deletedName) {
      return new Promise((resolve) => {
        this.$dialog
        .confirm(this.$t("confirm.deleteMessage"),this.options)
        .then(async function(dialog) {
          resolve(await this.deleteHelper(op,subIndex,resName, resType, resOrig, idName, payload, deletedName));
        }.bind(this))
        .catch(async function() {
          resolve(false);
        }.bind(this));
      });
    },
    async deleteHelper(op,subIndex,resName,resType,resOrig,idName,payload,deletedName) {
      let res;
      if (op==null)
        res=await this.operationWithCheck(async () => await GraphileService.delete(resType,resOrig,payload,idName));
      else {
        let id=utils.extractId(idName,payload);
        //let sub=op.subList[subIndex] ?? {};
        let deleteList=op.subList[subIndex] ? op.subList[subIndex].deleteList : [];
        let deleteListPayload=op.subList[subIndex] ? op.subList[subIndex].deleteListPayload : [];
        res=await this.operationWithCheck(async () => await GraphileService.mutation([
          await this.makeProgressOp(op,subIndex,{
            type: enums.OP_TYPE.LIST,
            deleteList: [...deleteList,id],
            deleteListPayload: [...deleteListPayload,payload],
            resType,resOrig,payload,idName
          })
        ]));
      }
      
      if (res) {
        this.showMessage({
          context: enums.TOAST_TYPE.SUCCESS,
          text: this.$i18n.t("toasts.deleted") +
            " " +
            resName +
            " " +
            deletedName({ v: res ? res.data : {}, p: payload })
        });
        return true;
      }
    },
    async makeRegisterOp(risorsa,tipo,dettagli,stato) {
      return await GraphileService._create("Operation",{
        operatore: "§uid",
        data: utils.postgreDate(new Date()),
        risorsa: risorsa,
        tipo: tipo,
        dettagli: dettagli,
        stato: stato
      },["data","operatore"]);
    },
    async makeProgressOp(op,subIndex,sub,data) {
      op.subList[subIndex]=sub;
      op.savedData[subIndex]=data;
      let r={
        subList: JSON.stringify(op.subList),
        savedData: JSON.stringify(op.savedData)
      };
      return await GraphileService._update("Operation",r,["data","operatore"],op.id);
    },
    async startOpHelper(opName,risorsa,dettagli,subCount,subList=null,savedData=null) {
      if (subList==null) subList=new Array(subCount).fill(null);
      if (savedData==null) savedData=new Array(subCount).fill(null);
      let draft=uuidv4();

      // clear list
      for (let i=0;i<subList.length;i++)
        if (subList[i] && subList[i].payload==null)
          subList[i]=null;

      let r={
        operatore: "§uid",
        data: utils.postgreDate(new Date()),
        risorsa: risorsa,
        tipo: "wizard",
        dettagli,
        stato: "draft",
        draft: draft,
        subList: JSON.stringify(subList),
        savedData: JSON.stringify(savedData),
        opName
      };

      let res=await this.operationWithCheck(async () => await GraphileService.create("Operation",r,["data","operatore"]),
        {code: "OP_START", extra: this.resourceTypes, stringify: true}
      );
      if (!res)
        return null;
      return {
        ...r,
        id: [ res.data.data, res.data.operatore ],
        subList,
        savedData,
        draft,
        opName
      };
    },
    async progressOpHelper(op,subIndex,sub,data) {
      let query=await this.makeProgressOp(op,subIndex,sub,data);
      let res=await this.operationWithCheck(async () => await GraphileService.mutation([query]),
        {code: "OP_UPDATE", extra: this.resourceTypes, stringify: true}
      );
      if (!res)
        return false;
      return true;
    },
    async saveOpHelper(op,subIndex,data) {
      op.savedData[subIndex]=data;
      let r={
        savedData: JSON.stringify(op.savedData)
      };

      let res=await this.operationWithCheck(async () => await GraphileService.update("Operation",r,["data","operatore"],op.id),
        {code: "OP_UPDATE", extra: this.resourceTypes, stringify: true}
      );
      if (!res)
        return false;
      return true;
    },
    async endOpHelper(op,dettagli) {
      let r={
        dettagli,
        stato: "complete"
      };

      let mlist=[];
      let deleteIndex=1;
      for (let o of op.subList) {
        if (o==null) continue;
        if (o.type==enums.OP_TYPE.UPDATE)
          mlist.push(await GraphileService._update(o.resType,o.payload,o.idName,o.currentId));
        else if (o.type==enums.OP_TYPE.LIST) {
          for (let p of o.deleteListPayload) {
            mlist.push(await GraphileService._delete(o.resType,o.resOrig,p,o.idName,"delete"+deleteIndex++));
          }
        }
      }
      mlist.push(await GraphileService._functionCall("opCommit"+op.opName,[
        {
          name: "draft",
          value: op.draft
        }
      ]));
      mlist.push(await GraphileService._update("Operation",r,["data","operatore"],op.id));

      let res=await this.operationWithCheck(async () => await GraphileService.mutation(mlist),
        {code: "OP_END", extra: this.resourceTypes, stringify: true}
      );
      if (!res)
        return false;
      this.showMessage({
        context: enums.TOAST_TYPE.SUCCESS,
        text:  this.$i18n.t("toasts.endOp",{
          resourceType: this.$i18n.t("resource_types."+op.risorsa)
        })
      });
      return true;
    },
    async abortOpHelper(op,dettagli) {
      let r={
        dettagli,
        stato: "abort"
      };

      let mlist=[];
      mlist.push(await GraphileService._functionCall("opAbort"+op.opName,[
        {
          name: "draft",
          value: op.draft
        }
      ]));
      mlist.push(await GraphileService._update("Operation",r,["data","operatore"],op.id));

      let res=await this.operationWithCheck(async () => await GraphileService.mutation(mlist),
        {code: "OP_END", extra: this.resourceTypes, stringify: true}
      );
      if (!res)
        return false;
      this.showMessage({
        context: enums.TOAST_TYPE.SUCCESS,
        text:  this.$i18n.t("toasts.abortOp",{
          resourceType: this.$i18n.t("resource_types."+op.risorsa)
        })
      });
      return true;
    },
    async abortConfirm(op,dettagli) {
      return new Promise((resolve) => {
        this.$dialog
        .confirm(this.$t("confirm.abortMessage"),this.options)
        .then(async function(dialog) {
          resolve(await this.abortOpHelper(op,dettagli));
        }.bind(this))
        .catch(async function() {
          resolve(false);
        }.bind(this));
      });
    },
    async findHelper(find,op,subIndex) {
      let sub=op.subList[subIndex];

      if (sub.payload)
        return sub.payload;
      
      let res=await find({
        draft: {value: op.draft}
      });
      if (res)
        return res[0][0];
      return null;
    },
    async getPref(name) {
      let res=await this.operationWithCheck(async () => await GraphileService.fetchOne("Preference",[],["§uid",name],["user","pref"]));
      if (res)
        return res.value;
      return null;
    },
    async setPref(name,value) {
      let res=await this.operationWithCheck(async () => await GraphileService.replace("Preference",{
        user: "§uid",
        pref: name,
        value: value
      },["user","pref"]));

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
    },

    doReplace(s,lang,bold=false) {
      if (!bold)
        for (const key in lang)
          s=s.replace("§"+key,lang[key]);
      else
        for (const key in lang)
          s=s.replace("§"+key,"<b>"+lang[key]+"</b>");
      return s;
    }
  }
}
