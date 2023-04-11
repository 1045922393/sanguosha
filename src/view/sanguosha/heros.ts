enum countryEnum {
  wei = '魏',
  shu = '蜀',
  wu = '吴',
  qun = '群',
}

enum sexEnum {
  male = '男',
  female = '女',
}

enum statusEnum {
  master = '主公',
  normal = '普通',
}

export default [
  {
    name: '刘备',
    country: countryEnum.shu,
    sex: sexEnum.male,
    blood: 4,
    status: statusEnum.master,
    // 普通技能
    skills: [
      {
        skillName: '仁德',
        skillDesc:
          '出牌阶段，你可以将任意张手牌交给其他角色，然后若你于此阶段内以此法给出的牌首次达到两张或更多，你回复1点体力。',
      },
      {
        skillName: '激将',
        skillDesc:
          '主公技，当你需要使用或打出【杀】时，你可以令其他蜀势力角色选择是否打出一张【杀】（视为由你使用或打出）。',
      },
    ],
    // 界限突破技能
    breakSills: [
      {
        skillName: '仁德',
        skillDesc:
          '出牌阶段，你可以将任意张手牌交给其他角色，然后此阶段内你不能再以此法交给该角色牌。若你于此阶段内给出的牌首次达到两张或更多，你可以视为使用一张基本牌。',
      },
      {
        skillName: '激将',
        skillDesc:
          '主公技，当你需要使用或打出【杀】时，你可以令其他蜀势力角色选择是否打出一张【杀】（视为由你使用或打出）；每回合限一次，其他蜀势力角色于其回合外使用或打出【杀】时，可令你摸一张牌。',
      },
    ],
  },
];
