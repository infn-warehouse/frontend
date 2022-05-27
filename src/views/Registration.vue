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
              :mode="enums.FORM_MODE.UPDATE"
              :selectedItem="orderItem"
              v-if="orderItem"
              :hasBack="true"
              @formCancel="handleOrderCancel"
              @formSucceed="handleOrderSave"
              @formBack="handleBack"
            />
          </v-stepper-content>
          <v-stepper-content step="3">
            <MovementForm
              :mode="enums.FORM_MODE.CREATE"
              :hasBack="true"
              @formCancel="handleMovementCancel"
              @formSucceed="handleMovementSave"
              @formBack="handleBack"
            />
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
    orderFind(filter) {
      return GraphileService.fetchAll("Ordini",[],[],filter);
    },
    movementFetch(id) {
      return GraphileService.fetchOne("MovimentiTemp",["documento"],id,"idMovimento");
    },
    async handleCigNext() {
      this.loading=true;
      let res=await this.operationWithCheck(async () => await this.orderFind({
        cig: {value: this.cig}
      }));
      this.loading=false;
      if (res) {
        let [items,total]=res;
        if (total>0) {
          this.orderItem=items[0];
          this.step++;
        }
        else {
          this.showMessage({
            context: enums.TOAST_TYPE.ERROR,
            text: this.$t('registration.orderNotFound')
          });
        }
      }
    },
    handleOrderSave() {
      this.step++;
    },
    handleMovementSave() {
      this.cig="";
      this.step=1;
    },
    handleBack() {
      this.step--;
    },
    handleOrderCancel() {
      this.orderItem={...this.orderItem};
    },
    handleMovementCancel() {
      this.movementItem={...this.movementItem};
    }
  },

  data() {
    return {
      title: this.$t("custom.registration"),
      step: 1,
      cig: "",
      orderItem: null,
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
