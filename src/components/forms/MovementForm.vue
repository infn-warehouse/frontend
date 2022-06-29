<template>
  <div>
    <v-card-title v-if="!hideTitle" class="form-title">{{
      this.formTitle | capitalize
    }}</v-card-title>
    <ValidationObserver v-slot="{ invalid }">
      <v-card-text>
        <div class="row-group">
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
                  :items="movementItems.inUscita"
                  item-text="name"
                  item-value="value"
                  :return-object="false"
                ></v-autocomplete>
                <span class="form-error">{{ errors[0] || "&nbsp;" }}</span>
              </ValidationProvider>
            </v-col>
          </v-row>
          <v-row>
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
              <DatePicker
                :label="$t('headers.movements.datadocumento')"
                v-model="form.datadocumento"
              ></DatePicker>
            </v-col>
            <v-col cols="4">
              <v-text-field
                :label="$t('headers.movements.nDocAcc')"
                v-model="form.nDocAcc"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="row-group">
          <v-row v-show="!form.inUscita">
            <v-col cols="4">
              <v-text-field
                :label="$t('headers.movements.nColli')"
                v-model="form.nColli"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <DatePicker
                :label="$t('headers.movements.dataConsegna')"
                v-model="form.dataConsegna"
              ></DatePicker>
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                :label="$t('headers.movements.tipoMovimento')"
                v-model="form.tipoMovimento"
                :items="movementItems.tipoMovimento"
                item-text="name"
                item-value="value"
                :return-object="false"
                clearable
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row v-show="!form.inUscita">
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
                :items="movementItems.tipoCollaudo"
                item-text="name"
                item-value="value"
                :return-object="false"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-text-field
                :label="$t('headers.movements.collaudatore')"
                v-model="form.collaudatore"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="row-group">
          <v-row v-show="form.inUscita">
            <v-col cols="6">
              <v-autocomplete
                :label="$t('headers.movements.tipoUscita')"
                v-model="form.tipoUscita"
                :items="movementItems.tipoUscita"
                item-text="name"
                item-value="value"
                :return-object="false"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                :label="$t('headers.movements.tipoReso')"
                v-model="form.tipoReso"
                :items="movementItems.tipoReso"
                item-text="name"
                item-value="value"
                :return-object="false"
                clearable
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row v-show="form.inUscita">
            <v-col cols="4">
              <DatePicker
                :label="$t('headers.movements.dataRitiro')"
                v-model="form.dataRitiro"
                mode="dateTime"
              ></DatePicker>
            </v-col>
            <v-col cols="4">
              <v-text-field
                :label="$t('headers.movements.corriere')"
                v-model="form.corriere"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                :label="$t('headers.movements.trackingNum')"
                v-model="form.trackingNum"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
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
import items from "@/mixins/items";
import formShared from "@/mixins/formShared";
import GraphileService from "@/services/graphile.service";
import utils from "../../utils";
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "MovementForm",

  mixins: [helper,formShared,items],
  
  data() {
    return {
      resourceType: this.$t("resource_types.movement"),
      formTitle: "",
      idName: "idMovimento",
      modelField: "idOrdine",
      emptyForm: {
        idMovimento: "",
        nMovimento: "",
        dataMovimento: utils.postgreDate(new Date()),
        idOrdine: "",
        datadocumento: "",
        tipoDocAcc: "",
        nDocAcc: "",
        dataConsegna: "",
        nColli: "",
        dataCollaudo: "",
        note: "",
        tipoCollaudo: "",
        collaudatore: "",
        inUscita: "",
        tipoMovimento: "",
        tipoUscita: "",
        tipoReso: "",
        dataRitiro: "",
        corriere: "",
        trackingNum: "",
        fileGroup: uuidv4()
      },
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
    movementGetLast() {
      return GraphileService.fetchAll("MovimentiTemp",[],[],null,null,{
        sortBy: ["nMovimento"],
        sortDesc: [true],
        page: 1,
        itemsPerPage: 1,
      });
    },
    async computeEmpty() {
      let res=await this.movementGetLast();
      this.emptyForm.nMovimento=res[0][0].nMovimento+1;
    }
  },
  
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
