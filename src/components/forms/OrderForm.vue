<template>
  <div>
    <v-card-title class="form-title">{{
      this.formTitle | capitalize
    }}</v-card-title>
    <ValidationObserver v-slot="{ invalid }">
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <ValidationProvider :name="$t('headers.orders.idordine')" immediate rules="required" v-slot="{ errors }">
              <v-text-field
                class="required"
                :label="$t('headers.orders.idordine')"
                v-model="form.idordine"
              ></v-text-field>
              <span class="form-error">{{ errors[0] || "&nbsp;" }}</span>
            </ValidationProvider>
          </v-col>
          <v-col cols="4">
            <ValidationProvider :name="$t('headers.orders.cig')" immediate rules="required" v-slot="{ errors }">
              <FetchAutocomplete
                class="required"
                :label="$t('headers.orders.cig')"
                v-model="form.cig"
                :disabled="locked || mode==enums.FORM_MODE.UPDATE"
                :fetch="protoOrderFetch"
                itemText="cig"
                itemValue="cig"
                :returnObject="false"
              ></FetchAutocomplete>
              <span class="form-error">{{ errors[0] || "&nbsp;" }}</span>
            </ValidationProvider>
          </v-col>
          <v-col cols="4">
            <DatePicker
              :label="$t('headers.orders.dataordine')"
              v-model="form.dataordine"
            ></DatePicker>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              :label="$t('headers.orders.fornitore')"
              v-model="form.fornitore"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :label="$t('headers.orders.descrizione')"
              v-model="form.descrizione"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              :label="$t('headers.orders.servizioRichi')"
              v-model="form.servizioRichi"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :label="$t('headers.orders.importo')"
              v-model="form.importo"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              :label="$t('headers.orders.terminiCons')"
              v-model="form.terminiCons"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              :label="$t('headers.orders.nConsegne')"
              v-model="form.nConsegne"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <DatePicker
              :label="$t('headers.orders.dataconsegna')"
              v-model="form.dataconsegna"
            ></DatePicker>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              :label="$t('headers.orders.responsabile')"
              v-model="form.responsabile"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              :label="$t('headers.orders.collaudatore')"
              v-model="form.collaudatore"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              :label="$t('headers.orders.rup')"
              v-model="form.rup"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-textarea
          :label="$t('headers.orders.note')"
          v-model="form.note"
          rows="1"
          auto-grow
          filled
        ></v-textarea>
      </v-card-text>
      <FormButtons
        :loading="loading"
        @onBack="onBack"
        @onNext="onSubmit"
        @onSave="onSubmit"
        @onCancel="onCancel"
        :disabled="invalid"
        :multiForm="multiForm"
        :multiLayout="multiLayout"
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
import utils from "../../utils";
import GraphileService from "@/services/graphile.service";
import FetchAutocomplete from "@/components/FetchAutocomplete";
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "OrderForm",

  mixins: [helper,formShared],

  data() {
    return {
      resourceType: this.$t("resource_types.order"),
      formTitle: "",
      idName: "idordine",
      emptyForm: {
        idordine: "",
        dataordine: utils.formatDate(new Date()),
        fornitore: "",
        descrizione: "",
        terminiCons: "",
        servizioRichi: "",
        responsabile: "",
        importo: "",
        statOrdine: "C",
        nConsegne: "",
        dataconsegna: "",
        collaudatore: "",
        note: "",
        cig: "",
        rup: "",
        fileGroup: uuidv4()
      }
    };

  },
  components: { FormButtons, DatePicker, FetchAutocomplete },

  methods: {
    async submitToStore() {
      return await this.createOrUpdateHelper(
        this.mode,
        this.resourceType,
        "Ordini",
        "idordine",
        this.form,
        this.currentId,
        payload => payload.p.idordine,
        payload => payload.p.idordine
      );
    },
    setTitle() {
      this.formTitle=this.makeTitle(this.resourceType,this.mode,this.form.idordine);
    },
    protoOrderFetch(paginationOpts=null,search) {
      return GraphileService.fetchAll("OrdiniProto",[],[],null,{search, on: ["cig"]},paginationOpts);
    },
  },
  
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
