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
              <ValidationProvider :name="$t('headers.movements.idordine')" immediate rules="required" v-slot="{ errors }">
                <v-text-field
                  class="required"
                  :label="$t('headers.movements.idordine')"
                  v-model="form.idordine"
                ></v-text-field>
                <span class="form-error">{{ errors[0] || "&nbsp;" }}</span>
              </ValidationProvider>
            </v-col>
            <v-col cols="3">
              <ValidationProvider :name="$t('headers.movements.cig')" immediate rules="required" v-slot="{ errors }">
                <FetchAutocomplete
                  class="required"
                  :label="$t('headers.movements.cig')"
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
            <v-col cols="3">
              <DatePicker
                :label="$t('headers.movements.dataordine')"
                v-model="form.dataordine"
              ></DatePicker>
            </v-col>
            <v-col cols="3">
              <v-autocomplete
                :label="$t('headers.movements.statOrdine')"
                v-model="form.statOrdine"
                :items="orderItems.statOrdine"
                item-text="name"
                item-value="value"
                :return-object="false"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                :label="$t('headers.movements.fornitore')"
                v-model="form.fornitore"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                :label="$t('headers.movements.descrizione')"
                v-model="form.descrizione"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                :label="$t('headers.movements.nColliOrdine')"
                v-model="form.nColliOrdine"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="row-group">
          <v-row>
            <v-col cols="6">
              <v-text-field
                :label="$t('headers.movements.servizioRichi')"
                v-model="form.servizioRichi"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :label="$t('headers.movements.importo')"
                v-model="form.importo"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <DatePicker
                :label="$t('headers.movements.dataconsegna')"
                v-model="form.dataconsegna"
              ></DatePicker>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :label="$t('headers.movements.rup')"
                v-model="form.rup"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <v-textarea
          :label="$t('headers.movements.noteOrdine')"
          v-model="form.noteOrdine"
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
import items from "@/mixins/items";

export default {
  name: "OrderForm",

  mixins: [helper,items,formShared],

  data() {
    return {
      resourceType: this.$t("resource_types.order"),
      formTitle: "",
      idName: "idordine",
      emptyForm: {
        idordine: "",
        dataordine: utils.postgreDate(new Date()),
        fornitore: "",
        descrizione: "",
        servizioRichi: "",
        importo: "",
        statOrdine: "C",
        dataconsegna: "",
        noteOrdine: "",
        cig: "",
        rup: "",
        nColliOrdine: "",
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
        this.formOld,
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
