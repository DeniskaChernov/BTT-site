import { SITE_MEDIA } from "@/lib/site-media";

export type InstagramHighlightCategory =
  | "project"
  | "material"
  | "process";

export type InstagramHighlight = {
  id: string;
  category: InstagramHighlightCategory;
  image: string;
  href: string;
  titleKey:
    | "insta_card_1_title"
    | "insta_card_2_title"
    | "insta_card_3_title"
    | "insta_card_4_title"
    | "insta_card_5_title"
    | "insta_card_6_title";
  descKey:
    | "insta_card_1_desc"
    | "insta_card_2_desc"
    | "insta_card_3_desc"
    | "insta_card_4_desc"
    | "insta_card_5_desc"
    | "insta_card_6_desc";
};

const INSTAGRAM_PROFILE = "https://www.instagram.com/bententrade/";

/**
 * Контентные карточки по мотивам постов и stories профиля @bententrade.
 * Держим локально, чтобы не зависеть от внешнего API/лимитов Instagram.
 */
export const INSTAGRAM_HIGHLIGHTS: InstagramHighlight[] = [
  {
    id: "insta-project-living",
    category: "project",
    image: SITE_MEDIA.categoryCard("btt-cat-planter"),
    href: INSTAGRAM_PROFILE,
    titleKey: "insta_card_1_title",
    descKey: "insta_card_1_desc",
  },
  {
    id: "insta-project-terrace",
    category: "project",
    image: SITE_MEDIA.heroPanel,
    href: INSTAGRAM_PROFILE,
    titleKey: "insta_card_2_title",
    descKey: "insta_card_2_desc",
  },
  {
    id: "insta-material-twisted",
    category: "material",
    image: SITE_MEDIA.categoryCard("btt-cat-twist"),
    href: INSTAGRAM_PROFILE,
    titleKey: "insta_card_3_title",
    descKey: "insta_card_3_desc",
  },
  {
    id: "insta-material-palette",
    category: "material",
    image: SITE_MEDIA.categoryCard("btt-cat-rattan"),
    href: INSTAGRAM_PROFILE,
    titleKey: "insta_card_4_title",
    descKey: "insta_card_4_desc",
  },
  {
    id: "insta-process-weaving",
    category: "process",
    image: SITE_MEDIA.categoryCard("btt-cat-new"),
    href: INSTAGRAM_PROFILE,
    titleKey: "insta_card_5_title",
    descKey: "insta_card_5_desc",
  },
  {
    id: "insta-process-shipping",
    category: "process",
    image: SITE_MEDIA.heroPanel,
    href: INSTAGRAM_PROFILE,
    titleKey: "insta_card_6_title",
    descKey: "insta_card_6_desc",
  },
];
