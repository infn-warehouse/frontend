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
            :label="$t('headers.movements.nMovimento')"
            v-model="form.nMovimento"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 2" immediate rules="required" v-slot="{ errors }">
          <v-text-field
            class="required"
            :label="$t('headers.movements.idOrdine')"
            v-model="form.idOrdine"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 3" immediate rules="required" v-slot="{ errors }">
          <FetchAutocomplete
            class="required"
            :label="$t('headers.movements.tipoDocAcc')"
            v-model="form.tipoDocAcc"
            :fetch="documentFetch"
            itemText="dicitura"
            itemValue="idocumento"
            :returnObject="false"
          ></FetchAutocomplete>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 4" immediate rules="required" v-slot="{ errors }">
          <v-text-field
            class="required"
            :label="$t('headers.movements.nDocAcc')"
            v-model="form.nDocAcc"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 5" immediate rules="required" v-slot="{ errors }">
          <DatePicker
            class="required"
            :label="$t('headers.movements.dataConsegna')"
            v-model="form.dataConsegna"
          ></DatePicker>
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
import FetchAutocomplete from "@/components/FetchAutocomplete";
import helper from "@/mixins/helper";
import formShared from "@/mixins/formShared";
import GraphileService from "@/services/graphile.service";

export default {
  name: "MovementForm",

  mixins: [helper,formShared],

  data() {
    return {
      resourceType: this.$t("resource_types.movement"),
      formTitle: "",
      form: {
        idMovimento: "",
        nMovimento: "",
        idOrdine: "",
        tipoDocAcc: null,
        nDocAcc: "",
        dataConsegna: ""
      },
    };

  },
  components: { FormButtons, DatePicker, FetchAutocomplete },

  methods: {
    async submitToStore() {
      await this.createOrUpdateHelper(
        this.mode,
        this.resourceType,
        "MovimentiTemp",
        "idMovimento",
        this.form,
        payload => payload.p.nMovimento,
        payload => payload.p.nMovimento
      );
    },
    setForm() {
      if (this.mode == enums.FORM_MODE.UPDATE) {
        this.form.idMovimento = this.selectedItem.idMovimento;
        this.form.nMovimento = this.selectedItem.nMovimento;
        this.form.idOrdine = this.selectedItem.idOrdine;
        this.form.tipoDocAcc = this.selectedItem.documentoByTipoDocAcc.idocumento;
        this.form.nDocAcc = this.selectedItem.nDocAcc;
        this.form.dataConsegna = this.selectedItem.dataConsegna;
      } else {
        this.form.idMovimento = "";
        this.form.nMovimento = "";
        this.form.idOrdine = "";
        this.form.tipoDocAcc = null;
        this.form.nDocAcc = "";
        this.form.dataConsegna = "";
      }
      this.formTitle=this.makeTitle(this.resourceType,this.mode,this.form.nMovimento);
    },
    documentFetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("Documento",[],[],filter,{search, on: ["dicitura"]},paginationOpts);
    },
  },
  
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
