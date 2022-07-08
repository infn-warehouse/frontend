<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="title"
      />
      <v-stepper v-model="step" flat>
        <v-stepper-header>
          <v-stepper-step :complete="step>1" step="1">
            {{ $t("registration.step1") }}
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step>2" step="2">
            {{ $t("registration.step2") }}
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step>3" step="3">
            {{ $t("registration.step3") }}
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step>4" step="4">
            {{ $t("registration.step4") }}
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step>5" step="5">
            {{ $t("registration.step5") }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <div class="my-container">
              <FetchAutocomplete
                class="required"
                :label="$t('registration.cig')"
                v-model="cig"
                :fetch="protoOrderFetch"
                itemText="cig"
                itemValue="cig"
                :returnObject="false"
              ></FetchAutocomplete>
            </div>
            <FormButtons
              @onNext="handleCigNext"
              :disabled="cig=='' || cig==null"
              :multiForm="true"
              :multiLayout="0"
              :noCancel="true"
              :loading="loading"
            />
          </v-stepper-content>
          <v-stepper-content step="2">
            <div class="big-container">
              <OrderForm
                v-if="step>1"
                :mode="orderExists ? enums.FORM_MODE.UPDATE : enums.FORM_MODE.CREATE"
                :selectedItem="orderItem"
                :multiForm="true"
                :multiLayout="1"
                @formCancel="handleOrderCancel"
                @formSucceed="handleOrderSave"
                @formBack="handleBack"
                :locked="true"
                :hideTitle="true"
                :op="op"
                :subIndex="0"
              />
            </div>
          </v-stepper-content>
          <v-stepper-content step="3">
            <div class="big-container">
              <MovementForm
                v-if="step>2"
                :mode="movementExists ? enums.FORM_MODE.UPDATE : enums.FORM_MODE.CREATE"
                :selectedItem="movementItem"
                :multiForm="true"
                :multiLayout="1"
                @formCancel="handleMovementCancel"
                @formSucceed="handleMovementSave"
                @formBack="handleBack"
                :model="orderItem.idordine"
                :hideTitle="true"
                :op="op"
                :subIndex="1"
              />
            </div>
          </v-stepper-content>
          <v-stepper-content step="4">
            <template v-if="step>3">
              <div class="my-container">
                <FileUploader
                  @onLoading="handleLoading"
                  @onUploadComplete="handleUpload1"
                  :fileGroup="orderItem.fileGroup"
                />
              </div>
              <FilesList
                ref="filesList1"
                :immutableFilter="orderItem.fileGroup"
                :title="$t('misc.attachments')"
                :noDetails="true"
              />
              <FormButtons
                :disabledAll="uploadIsLoading>0"
                @onNext="handleUploadNext1"
                @onBack="handleBack"
                :multiForm="true"
                :multiLayout="1"
                :noCancel="true"
              />
            </template>
          </v-stepper-content>
          <v-stepper-content step="5">
            <template v-if="step>4">
              <div class="my-container">
                <FileUploader
                  @onLoading="handleLoading"
                  @onUploadComplete="handleUpload2"
                  :fileGroup="movementItem.fileGroup"
                />
              </div>
              <FilesList
                ref="filesList2"
                :immutableFilter="movementItem.fileGroup"
                :title="$t('misc.attachments')"
                :noDetails="true"
              />
              <FormButtons
                :disabledAll="uploadIsLoading>0"
                @onNext="handleUploadNext2"
                @onBack="handleBack"
                :multiForm="true"
                :multiLayout="1"
                :noCancel="true"
              />
            </template>
          </v-stepper-content>
          <v-stepper-content step="6">
            <v-card-text v-if="step>5">
              <v-icon x-large>{{ enums.ICONS.DONE }}</v-icon>
              <div class="inner-element">{{$t('registration.complete')}}</div>
              <div class="inner-element"><a @click="restart">{{$t('registration.new')}}</a></div>
              <div class="bottom-element"><a @click="go">{{$t('registration.go')}} {{movementItem.nMovimento}}</a></div>
            </v-card-text>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import helper from "@/mixins/helper";
import OrderForm from "@/components/forms/OrderForm";
import MovementForm from "@/components/forms/MovementForm";
import GraphileService from "@/services/graphile.service";
import enums from "@/enums";
import FormButtons from "@/components/FormButtons";
import FetchAutocomplete from "@/components/FetchAutocomplete";
import FileUploader from "@/components/FileUploader";
import FilesList from "@/views/FilesList";

export default {
  name: 'Registration',

  components: {
    OrderForm,
    MovementForm,
    Toolbar,
    FormButtons,
    FetchAutocomplete,
    FileUploader,
    FilesList
  },

  props: [
    "resumeOp",
  ],

  mixins: [helper],

  computed: {
    enums() {
      return enums;
    },
  },

  async created() {
    if (this.resumeOp) {
      if (this.resumeOp.subList[0]) {
        let payload=await this.findHelper(this.orderFind,this.resumeOp.subList[0]);
        if (payload) {
          this.orderExists=true;
          this.orderItem=payload;
        }
      }
      if (this.resumeOp.subList[1]) {
        let payload=await this.findHelper(this.movementFind,this.resumeOp.subList[1]);
        if (payload) {
          this.movementExists=true;
          this.movementItem=payload;
        }
      }
      
      this.op=this.resumeOp;
      this.step++;
    }
  },

  methods: {
    protoOrderFind(filter) {
      return GraphileService.fetchAll("OrdiniProto",[],[],filter);
    },
    orderFind(filter) {
      return GraphileService.fetchAll("Ordini",[],[],filter);
    },
    movementFind(filter) {
      return GraphileService.fetchAll("MovimentiTemp",["documento"],[],filter);
    },
    protoOrderFetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("OrdiniProto",[],[],filter,{search, on: ["cig"]},paginationOpts);
    },
    async handleCigNext() {
      this.loading=true;

      let resProto=await this.operationWithCheck(async () => await this.protoOrderFind({
        cig: {value: this.cig}
      }));
      if (!resProto) {
        this.loading=false;
        return;
      }

      let res=await this.operationWithCheck(async () => await this.orderFind({
        cig: {value: this.cig}
      }));
      if (!res) {
        this.loading=false;
        return;
      }

      this.loading=false;

      let [itemsProto,totalProto]=resProto;
      let [items,total]=res;
      if (total>0) {
        this.orderExists=true;
        this.orderItem=items[0];
        if (await this.startOp()) this.step++;
      }
      else if (totalProto>0) {
        this.orderExists=false;
        this.orderItem=JSON.parse(itemsProto[0].orderData);
        this.orderItem.cig=this.cig;
        if (await this.startOp()) this.step++;
      }
      else {
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: this.$t('registration.orderNotFound')
        });
      }
    },
    async startOp() {
      this.op=await this.startOpHelper(this.resourceTypes,"",2,[
        this.orderExists ? {
          type: enums.FORM_MODE.UPDATE,
          payload: this.orderItem
        } : null,
        null
      ],[
        this.orderItem,
        null
      ]);
      return this.op!=null;
    },
    handleOrderSave(form,next) {
      this.orderExists=true;
      this.orderItem=form;
      if (next) this.step++;
    },
    handleMovementSave(form,next) {
      this.movementExists=true;
      this.movementItem=form;
      if (next) this.step++;
    },
    handleUploadNext1() {
      this.step++;
    },
    handleUploadNext2() {
      let res=this.endOpHelper(this.op,"end","");
      if (res) this.step++;
    },
    handleBack() {
      this.step--;
    },
    handleOrderCancel() {
      this.orderItem={...this.orderItem};
    },
    handleMovementCancel() {
      this.movementItem={...this.movementItem};
    },
    go() {
      this.$router.push({
        name: "MovementDetails",
        params: { id: this.movementItem.idMovimento.toString() }
      }).catch(()=>{});
    },
    restart() {
      this.step=1;
      this.cig="";
      this.movementExists=false;
      this.movementItem=null;
    },
    handleUpload1(file) {
      this.$refs.filesList1.refresh();
    },
    handleUpload2(file) {
      this.$refs.filesList2.refresh();
    },
    handleLoading(isLoading) {
      if (isLoading)
        this.uploadIsLoading++;
      else
        this.uploadIsLoading--;
    }
  },

  data() {
    return {
      resourceType: this.$t("resource_types.registration"),
      resourceTypes: this.$t("resource_types.registrations"),
      title: this.$t("custom.registration"),
      step: 1,
      cig: "",
      orderItem: null,
      movementItem: null,
      orderExists: false,
      movementExists: false,
      loading: false,
      uploadIsLoading: 0,
      op: null
    };
  }
};
</script>

<style scoped>
.v-stepper__header {
  box-shadow: none;
}
</style>
