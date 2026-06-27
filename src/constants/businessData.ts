export const BUSINESS_GROUPS = {
  professional: {
    label: "전문",
    categories: [
      {
        label: "가스난방공사업",
        specialties: ["난방공사(1종)", "난방공사(2종)", "난방공사(3종)"],
      },
      {
        label: "구조물해체·비계공사업",
        specialties: ["구조물해체공사", "비계공사"],
      },
      {
        label: "금속창호·지붕건축물조립공사업",
        specialties: ["금속구조물·창호·온실공사", "지붕판금·건축물조립공사"],
      },
      {
        label: "기계가스설비공사업",
        specialties: [
          "기계설비공사",
          "가스시설공사(1종)",
          "가스시설공사(2종)",
          "가스시설공사(3종)",
        ],
      },
      {
        label: "도장·습식·방수·석공사업",
        specialties: ["도장공사", "습식·방수공사", "석공사"],
      },
      {
        label: "상·하수도설비공사업",
        specialties: ["상·하수도설비공사"],
      },
      {
        label: "수중·준설공사업",
        specialties: ["수중공사", "준설공사"],
      },
      {
        label: "승강기·삭도공사업",
        specialties: ["승강기설치공사", "삭도설치공사"],
      },
      {
        label: "실내건축공사업",
        specialties: ["실내건축공사"],
      },
      {
        label: "조경식재·시설물공사업",
        specialties: ["조경식재공사", "조경시설물설치공사"],
      },
      {
        label: "지반조성·포장공사업",
        specialties: ["토공사", "포장공사", "보링·그라우팅·파일공사"],
      },
      {
        label: "철강구조물공사업",
        specialties: ["철강재설치공사"],
      },
      {
        label: "철근·콘크리트공사업",
        specialties: ["철근·콘크리트공사"],
      },
      {
        label: "철도·궤도공사업",
        specialties: ["철도공사", "궤도공사"],
      },
    ],
  },

  general: {
    label: "종합",
    categories: ["건축공사업", "토목공사업", "토목건축공사업", "조경공사업"],
  },

  electrical: {
    label: "전소통",
    categories: ["전기공사업", "소방시설공사업", "정보통신공사업"],
  },
};

export const BUSINESS_GROUP_LABELS = {
  professional: "전문",
  electrical: "전소통",
  general: "종합",
} as const;

export const INTEREST_LEVEL_LABELS = {
  high: "상",
  medium: "중",
  low: "하",
} as const;
