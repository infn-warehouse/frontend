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
            :label="$t('headers.movements.idOrdine')"
            v-model="form.idOrdine"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 2" immediate rules="required" v-slot="{ errors }">
          <FetchAutocomplete
            class="required"
            :label="$t('headers.movements.tipoDocAcc')"
            v-model="form.documento"
            :fetch="documentFetch"
            itemText="dicitura"
            itemValue="idocumento"
            :returnObject="false"
          ></FetchAutocomplete>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 3" immediate rules="required" v-slot="{ errors }">
          <v-text-field
            class="required"
            :label="$t('headers.movements.nDocAcc')"
            v-model="form.nDocAcc"
          ></v-text-field>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <ValidationProvider name="Prova 4" immediate rules="required" v-slot="{ errors }">
          <DatePicker
            class="required"
            :label="$t('headers.movements.dataConsegna')"
            v-model="form.dataConsegna"
          ></DatePicker>
          <span class="form-error">{{ errors[0] }}</span>
        </ValidationProvider>
      </v-card-text>
      <FormButtons
        @onSave="onSubmit"
        @onCancel="onCancel"
        :disabled="invalid"
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
        idOrdine: "",
        documento: -1,
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
        "service",
        this.form,
        payload => payload.v.id,
        payload => payload.p.id
      );
    },
    setForm() {
      if (this.mode == enums.FORM_MODE.UPDATE) {
        this.form.idOrdine = this.selectedItem.idOrdine;
        this.form.documento = this.selectedItem.documentoByTipoDocAcc.idocumento;
        this.form.nDocAcc = this.selectedItem.nDocAcc;
        this.form.dataConsegna = this.selectedItem.dataConsegna;
      } else {
        this.form.idOrdine = "";
        this.form.documento = -1;
        this.form.nDocAcc = "";
        this.form.dataConsegna = "";
      }
      this.formTitle=this.makeTitle(this.resourceType,this.mode,this.form.idOrdine);
    },
    documentFetch(paginationOpts=null,search) {
      return GraphileService.fetchAll("Documento",[],paginationOpts,search,null);
    },
  },
  
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
