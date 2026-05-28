import { createRouter, createWebHistory } from 'vue-router'
import CharacterListView from '../views/CharacterListView.vue'
import CharacterView from '../views/CharacterView.vue'
import SkillsTab from '../tabs/SkillsTab.vue'
import CombatTab from '../tabs/CombatTab.vue'
import InventoryTab from '../tabs/InventoryTab.vue'
import BackgroundTab from '../tabs/BackgroundTab.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: CharacterListView },
    {
      path: '/character/:id',
      component: CharacterView,
      children: [
        { path: '', redirect: (to) => ({ name: 'skills', params: to.params }) },
        { path: 'skills', name: 'skills', component: SkillsTab },
        { path: 'combat', name: 'combat', component: CombatTab },
        { path: 'inventory', name: 'inventory', component: InventoryTab },
        { path: 'background', name: 'background', component: BackgroundTab },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
