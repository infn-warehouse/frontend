<template>
  <div class="my-container">
    <v-card>
      <Toolbar
        :title="detailsTitle"
        :withBack="true"
        :withEdit="true"
        :withDelete="true"
        @onEdit="openUpdate(selectedItem)"
        @onDelete="handleDelete"
      ></Toolbar>

      <v-tabs
        v-model="activeTab"
        @change="syncUrl"
        background-color="secondary"
        slider-color="accent"
        dark
      >
        <v-tab key="tab1">{{ $t("details.movements.tab1") }}</v-tab>
        <v-tab key="tab2">{{ $t("details.movements.tab2") }}</v-tab>
        <v-tab key="tab3">{{ $t("details.movements.tab3") }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="activeTab">
        <v-tab-item key="tab1">
          <div class="my-container">
            {{this.selectedItem.nMovimento}}
          </div>
        </v-tab-item>
        <v-tab-item key="tab2">
          <div class="my-container">
            {{this.selectedItem.idOrdine}}
          </div>
        </v-tab-item>
        <v-tab-item key="tab3">
          <div class="my-container">
            {{this.selectedItem.nDocAcc}}
          </div>
        </v-tab-item>
      </v-tabs-items>
      <v-dialog
        v-model="formDialog"
        content-class="edit-form-dialog"
      >
        <v-card>
          <MovementForm
            v-if="formDialog"
            :mode="mode"
            :selectedItem="editItem"
            @formSucceed="fetch()"
            @formClose="close()"
          />
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import enums from "@/enums";
import helper from "@/mixins/helper";
import MovementForm from "@/components/forms/MovementForm";
import Toolbar from "@/components/Toolbar";
import formDialog from "@/mixins/formDialog";
import detailsShared from "@/mixins/detailsShared";
import GraphileService from "@/services/graphile.service";
import { mapMutations } from "vuex";

export default {
  name: "MovementDetails",
  data() {
    return {
      home: "Movements",
      resourceType: this.$t("resource_types.movement"),
    };
  },
  methods: {
    ...mapMutations("filters", ["setUsersFlag"]),
    
    fetch(id) {
      return GraphileService.fetchOne("MovimentiTemp",["documento"],id);
    },
    
    title(item) {
      return this.makeTitleDetails(this.resourceType,item.idMovimento);
    },

    delete(item) {
      return this.deleteConfirm(
        this.resourceType,
        "service",
        item,
        payload => payload.p.id
      );
    },
  },
  created() {
    this.setUsersFlag(true);
  },
  components: {
    MovementForm,
    Toolbar,
  },
  mixins: [helper,formDialog,detailsShared],
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
