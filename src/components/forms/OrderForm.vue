<template>
  <div>
    <v-card-title class="form-title">{{
      this.formTitle | capitalize
    }}</v-card-title>
    <ValidationObserver v-slot="{ invalid }">
      <v-card-text>
        <ValidationProvider name="Prova 1" immediate rules="required" v-slot="{ errors }">
          <v-text-field
            class="required"
            :label="$t('headers.orders.idordine')"
            v-model="form.idordine"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 2" immediate rules="required" v-slot="{ errors }">
          <DatePicker
            class="required"
            :label="$t('headers.orders.dataordine')"
            v-model="form.dataordine"
          ></DatePicker>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 3" immediate rules="required" v-slot="{ errors }">
          <v-text-field
            class="required"
            :label="$t('headers.orders.fornitore')"
            v-model="form.fornitore"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 4" immediate rules="required" v-slot="{ errors }">
          <v-text-field
            class="required"
            :label="$t('headers.orders.descrizione')"
            v-model="form.descrizione"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
      </v-card-text>
      <FormButtons
        :loading="loading"
        @onSave="onSubmit"
        @onCancel="onCancel"
        @onBack="onBack"
        :disabled="invalid"
        :multiForm="hasBack"
        multiLayout="2"
      />
    </ValidationObserver>
  </div>
</template>

<script>
import enums from "@/enums";
import FormButtons from "@/components/FormButtons";
import DatePicker from "@/components/DatePicker";
import helper from "@/mixins/helper";
import formShared from "@/mixins/formShared";

export default {
  name: "OrderForm",

  mixins: [helper,formShared],

  data() {
    return {
      resourceType: this.$t("resource_types.order"),
      formTitle: "",
      form: {
        idordine: "",
        dataordine: "",
        fornitore: "",
        descrizione: "",
      },
    };

  },
  components: { FormButtons, DatePicker },

  methods: {
    async submitToStore() {
      await this.createOrUpdateHelper(
        this.mode,
        this.resourceType,
        "Ordini",
        "idordine",
        this.form,
        payload => payload.p.idordine,
        payload => payload.p.idordine
      );
    },
    setForm() {
      if (this.mode == enums.FORM_MODE.UPDATE) {
        this.form.idordine = this.selectedItem.idordine;
        this.form.dataordine = this.selectedItem.dataordine;
        this.form.fornitore = this.selectedItem.fornitore;
        this.form.descrizione = this.selectedItem.descrizione;
      } else {
        this.form.idordine = "";
        this.form.dataordine = "";
        this.form.fornitore = "";
        this.form.descrizione = "";
      }
      this.formTitle=this.makeTitle(this.resourceType,this.mode,this.form.idordine);
    },
  },
  
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
