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
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card-text>
              <v-text-field
                class="required"
                :label="$t('registration.cig')"
                v-model="cig"
              ></v-text-field>
            </v-card-text>
            <FormButtons
              @onNext="handleCigNext"
              :disabled="cig==''"
              :multiForm="true"
              :multiLayout="0"
              :noCancel="true"
              :loading="loading"
            />
          </v-stepper-content>
          <v-stepper-content step="2">
            <OrderForm
              v-if="step>1"
              :mode="orderExists ? enums.FORM_MODE.UPDATE : enums.FORM_MODE.CREATE"
              :selectedItem="orderItem"
              :multiForm="true"
              :multiLayout="1"
              @formCancel="handleOrderCancel"
              @formSucceed="handleOrderSave"
              @formBack="handleBack"
            />
          </v-stepper-content>
          <v-stepper-content step="3">
            <MovementForm
              v-if="step>2"
              :mode="enums.FORM_MODE.CREATE"
              :multiForm="true"
              :multiLayout="1"
              @formCancel="handleMovementCancel"
              @formSucceed="handleMovementSave"
              @formBack="handleBack"
              :withModelId="orderItem.idordine"
            />
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-card-text v-if="step>3">
              <v-icon x-large>{{ enums.ICONS.DONE }}</v-icon>
              <div class="inner-element">{{$t('registration.complete')}}</div>
              <div class="inner-element"><a @click="go">{{$t('registration.go')}} {{orderItem.idordine}}</a></div>
              <div class="bottom-element"><a @click="restart">{{$t('registration.new')}}</a></div>
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

export default {
  name: 'Registration',

  components: {
    OrderForm,
    MovementForm,
    Toolbar,
    FormButtons
  },

  mixins: [helper],

  computed: {
    enums() {
      return enums;
    }
  },

  methods: {
    protoOrderFind(filter) {
      return GraphileService.fetchAll("OrdiniProto",[],[],filter);
    },
    orderFind(filter) {
      return GraphileService.fetchAll("Ordini",[],[],filter);
    },
    movementFetch(id) {
      return GraphileService.fetchOne("MovimentiTemp",["documento"],id,"idMovimento");
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
        this.step++;
      }
      else if (totalProto>0) {
        this.orderExists=false;
        this.orderItem=JSON.parse(itemsProto[0].orderData);
        this.step++;
      }
      else {
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: this.$t('registration.orderNotFound')
        });
      }
    },
    handleOrderSave(form) {
      this.orderExists=true;
      this.orderItem=form;
      this.step++;
    },
    handleMovementSave() {
      this.cig="";
      this.step++;
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
        name: "OrderDetails",
        params: { id: this.orderItem.idordine.toString() }
      }).catch(()=>{});
    },
    restart() {
      this.step=1;
    }
  },

  data() {
    return {
      title: this.$t("custom.registration"),
      step: 1,
      cig: "",
      orderItem: null,
      orderExists: false,
      loading: false
    };
  }
};
</script>

<style scoped>
.v-stepper__header {
  box-shadow: none;
}
</style>
