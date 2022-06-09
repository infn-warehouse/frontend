<template>
  <div>
    <v-card-title class="form-title">{{
      this.formTitle | capitalize
    }}</v-card-title>
    <ValidationObserver v-slot="{ invalid }">
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <ValidationProvider :name="$t('headers.movements.nMovimento')" immediate rules="required" v-slot="{ errors }">
              <v-text-field
                class="required"
                :label="$t('headers.movements.nMovimento')"
                v-model="form.nMovimento"
              ></v-text-field>
              <span class="form-error">{{ errors[0] || "&nbsp;" }}</span>
            </ValidationProvider>
          </v-col>
          <v-col cols="3">
            <ValidationProvider :name="$t('headers.movements.idOrdine')" immediate rules="required" v-slot="{ errors }">
              <FetchAutocomplete
                class="required"
                :label="$t('headers.movements.idOrdine')"
                v-model="form.idOrdine"
                :fetch="orderFetch"
                itemText="idordine"
                itemValue="idordine"
                :returnObject="false"
                :model="model"
                :mode="mode"
              ></FetchAutocomplete>
              <span class="form-error">{{ errors[0] || "&nbsp;" }}</span>
            </ValidationProvider>
          </v-col>
          <v-col cols="3">
            <DatePicker
              :label="$t('headers.movements.dataMovimento')"
              v-model="form.dataMovimento"
            ></DatePicker>
          </v-col>
          <v-col cols="3">
            <ValidationProvider :name="$t('headers.movements.inUscita')" immediate rules="required" v-slot="{ errors }">
              <v-autocomplete
                class="required"
                :label="$t('headers.movements.inUscita')"
                v-model="form.inUscita"
                :items="inUscitaItems"
                item-text="name"
                item-value="value"
                :return-object="false"
              >
              </v-autocomplete>
              <span class="form-error">{{ errors[0] || "&nbsp;" }}</span>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <DatePicker
              :label="$t('headers.movements.datadocumento')"
              v-model="form.datadocumento"
            ></DatePicker>
          </v-col>
          <v-col cols="4">
            <FetchAutocomplete
              :label="$t('headers.movements.tipoDocAcc')"
              v-model="form.tipoDocAcc"
              :fetch="documentFetch"
              itemText="dicitura"
              itemValue="idocumento"
              :returnObject="false"
            ></FetchAutocomplete>
          </v-col>
          <v-col cols="4">
            <v-text-field
              :label="$t('headers.movements.nDocAcc')"
              v-model="form.nDocAcc"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <DatePicker
              :label="$t('headers.movements.dataConsegna')"
              v-model="form.dataConsegna"
            ></DatePicker>
          </v-col>
          <v-col cols="3">
            <v-text-field
              :label="$t('headers.movements.consegnatario')"
              v-model="form.consegnatario"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              :label="$t('headers.movements.nColli')"
              v-model="form.nColli"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              :label="$t('headers.movements.tipoMovimento')"
              v-model="form.tipoMovimento"
              :items="tipoMovimentoItems"
              item-text="name"
              item-value="value"
              :return-object="false"
              clearable
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <DatePicker
              :label="$t('headers.movements.dataCollaudo')"
              v-model="form.dataCollaudo"
            ></DatePicker>
          </v-col>
          <v-col cols="4">
            <v-autocomplete
              :label="$t('headers.movements.tipoCollaudo')"
              v-model="form.tipoCollaudo"
              :items="tipoCollaudoItems"
              item-text="name"
              item-value="value"
              :return-object="false"
              clearable
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-text-field
          :label="$t('headers.movements.codificaSpaziale')"
          v-model="form.codificaSpaziale"
        ></v-text-field>
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
import FetchAutocomplete from "@/components/FetchAutocomplete";
import helper from "@/mixins/helper";
import formShared from "@/mixins/formShared";
import GraphileService from "@/services/graphile.service";
import utils from "../../utils";
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "MovementForm",

  mixins: [helper,formShared],

  data() {
    return {
      resourceType: this.$t("resource_types.movement"),
      formTitle: "",
      idName: "idMovimento",
      modelField: "idOrdine",
      emptyForm: {
        idMovimento: "",
        nMovimento: "",
        dataMovimento: utils.formatDate(new Date()),
        idOrdine: "",
        datadocumento: "",
        tipoDocAcc: "",
        nDocAcc: "",
        dataConsegna: "",
        consegnatario: "",
        nColli: "",
        dataCollaudo: "",
        note: "",
        codificaSpaziale: "",
        tipoCollaudo: "",
        inUscita: "",
        tipoMovimento: "",
        fileGroup: uuidv4()
      },
      inUscitaItems: [
        { name: this.$t("custom.inbound"), value: false },
        { name: this.$t("custom.outbound"), value: true }
      ],
      tipoMovimentoItems: [
        { name: this.$t("custom.c"), value: 'C' },
        { name: this.$t("custom.s"), value: 'S' }
      ],
      tipoCollaudoItems: [
        { name: this.$t("custom.a_type"), value: "A" },
        { name: this.$t("custom.b_type"), value: "B" },
        { name: this.$t("custom.f_type"), value: "F" }
      ]
    };
  },
  components: { FormButtons, DatePicker, FetchAutocomplete },

  methods: {
    async submitToStore() {
      return await this.createOrUpdateHelper(
        this.mode,
        this.resourceType,
        "MovimentiTemp",
        "idMovimento",
        this.form,
        this.formOld,
        this.currentId,
        payload => payload.p.nMovimento,
        payload => payload.p.nMovimento
      );
    },
    setTitle() {
      this.formTitle=this.makeTitle(this.resourceType,this.mode,this.form.nMovimento);
    },
    documentFetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("Documento",[],[],filter,{search, on: ["dicitura"]},paginationOpts);
    },
    orderFetch(paginationOpts=null,search,filter) {
      return GraphileService.fetchAll("Ordini",[],[],filter,{search, on: ["idordine"]},paginationOpts);
    },
  },
  
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
