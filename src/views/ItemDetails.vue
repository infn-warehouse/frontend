<template>
  <div class="flex-container">
    <v-card>
      <Toolbar
        :title="detailsTitle"
        :withBack="true"
        :withEdit="true"
        :withDelete="true"
        @onEdit="openUpdate(selectedItem)"
        @onDelete="handleDelete"
      ></Toolbar>

      <template v-if="selectedItem">
        <v-tabs
          v-model="activeTab"
          @change="syncUrl"
          background-color="secondary"
          slider-color="accent"
          dark
        >
          <v-tab key="tabLoading">{{ $t("details.items.tabLoading") }}</v-tab>
          <v-tab key="tabUnloading">{{ $t("details.items.tabUnloading") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTab">
          <v-tab-item key="tabLoading">
            <div class="flex-container">
            </div>
          </v-tab-item>
          <v-tab-item key="tabUnloading">
            <div class="flex-container">
              <UnloadingMovsList
                :immutableFilter="selectedItem.codiceArticolo"
              />
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
      </template>
    </v-card>
  </div>
</template>

<script>
import enums from "@/enums";
import helper from "@/mixins/helper";
import MovementForm from "@/components/forms/MovementForm";
import UnloadingMovsList from "@/views/UnloadingMovsList";
import Toolbar from "@/components/Toolbar";
import formDialog from "@/mixins/formDialog";
import detailsShared from "@/mixins/detailsShared";
import GraphileService from "@/services/graphile.service";
import { mapMutations } from "vuex";

export default {
  name: "ItemDetails",
  data() {
    return {
      home: "Items",
      resourceType: this.$t("resource_types.item"),
    };
  },
  methods: {
    ...mapMutations("filters", ["setItemsFlag"]),
    
    fetch(id) {
      return GraphileService.fetchOne("Articoli",[],id,"codiceArticolo");
    },
    
    title(item) {
      return this.makeTitleDetails(this.resourceType,item.codiceArticolo+" ("+item.descrizione+" | "+item.specifica+")");
    },

    delete(item) {
      return this.deleteConfirm(
        this.resourceType,
        "Articoli",
        "Articoli",
        "codiceArticolo",
        item,
        payload => payload.p.id
      );
    },
  },
  created() {
    this.setItemsFlag(true);
  },
  components: {
    MovementForm,
    Toolbar,
    UnloadingMovsList,
  },
  mixins: [helper,formDialog,detailsShared],
  computed: {
    enums() {
      return enums;
    },
  },
};
</script>
