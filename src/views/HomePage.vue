<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader title="Горная Югра" :show-back="false" />
    <main class="flex-1 container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <div class="w-full p-6 gap-6">
        <div class="flex flex-wrap">
          <div class="flex lg:flex-1">
            <img src="/home-pic.png" alt="" />
          </div>
          <div class="flex flex-col lg:flex-1 w-full justify-between p-6">
            <h1 class="text-4xl xl:text-6xl mb-15">Гора На́родная</h1>
            <div
              class="flex w-full justify-between border-b border-dashed mb-6 text-3xl xl:text-4xl font-tektur">
              <p>Долгота</p>
              <p>65° 02′</p>
            </div>
            <div
              class="flex w-full justify-between border-b border-dashed mb-6 text-3xl xl:text-4xl font-tektur">
              <p>Широта</p>
              <p>60° 07′</p>
            </div>
            <div
              class="flex w-full justify-between border-b border-dashed mb-6 text-3xl xl:text-4xl font-tektur">
              <p>Высота</p>
              <p>1895м</p>
            </div>
            <p class="text-xl opacity-70">
              Гора Народная является высочайщей на Приполярном Урале
            </p>
          </div>
        </div>
      </div>

      <!-- Featured Categories -->
      <section class="py-12">
        <!-- <h2 class="text-3xl font-display font-bold text-primary mb-8">
          Категории
        </h2> -->

        <ItemHome
          href="categories/mineral"
          color="bg-[#373930]"
          flex="flex-row"
          image="/home-stone.png"
          name="Минералы"
          desc="Каталог месторождений полезных ископаемых, драгоценных камней и
          кристаллов, найденных в регионе" />

        <ItemHome
          href="categories/etnos"
          color="bg-[#9e6f52]"
          flex="flex-row-reverse"
          image="/home-etno.png"
          name="Этнос"
          desc="Информация о народах и этнических группах, населяющих регион, их
          культуре и традициях" />

        <ItemHome
          href="categories/priroda"
          color="bg-[#515144]"
          flex="flex-row"
          image="/home-nature.png"
          name="Природа"
          desc="Раздел о природных объектах Приполярного Урала, включая гору Народную,
          ледники, редких животных и растения" />

        <ItemHome
          href="categories/istoria"
          color="bg-[#433e39]"
          flex="flex-row-reverse"
          image="/home-hist.png"
          name="История"
          desc="Описание научных экспедиций и геологических исследований Приполярного
          Урала с конца XIX века по 1928 год" />

        <ItemHome
          href="categories/tury"
          color="bg-[#4d413d]"
          flex="flex-row"
          image="/home-tour.png"
          name="Туры"
          desc="Предложения туристических маршрутов, экскурсий по природным и
          историческим достопримечательностям региона" />

        <ItemHome
          href="#"
          color="bg-[#98745e]"
          flex="flex-row-reverse"
          image="/home-souv.png"
          name="Сувениры"
          desc="Каталог подарков и изделий местного производства, включая украшения из
          камня и изделия ручной работы" />

        <ItemHome
          href="#"
          color="bg-[#454345]"
          flex="flex-row"
          image="/home-ekonom.png"
          name="Экономика"
          desc="Информация о хозяйственной деятельности региона, включая месторождение
          Додо, оленеводство, производство кварца и туризм" />
      </section>
    </main>

    <div class="text-center p-10 flex flex-col items-center">
      <p class="text-4xl font-cursive lg:text-6xl xl:w-6xl">
        Сколько же скрыто природных даров ещё в поймах, в отрогах, в расщелинах
        скал…
      </p>
      <p class="text-4xl font-cursive lg:text-6xl xl:w-6xl">
        Сам по себе регион, как сокровище – Наш дорогой Приполярный Урал!
      </p>
      <p class="opacity-60 text-xl lg:text-2xl">Александр Кузин</p>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import CategoryCard from "@/components/categories/CategoryCard.vue";
import { useCategories } from "@/composables/useCategories";
import ItemHome from "../components/items/ItemHome.vue";

const { categories, loading, error, fetchCategories } = useCategories();

onMounted(async () => {
  await fetchCategories({ limit: 6 });
});
</script>
