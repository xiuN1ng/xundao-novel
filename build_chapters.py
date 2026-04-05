import json

with open('data/story.json', 'r', encoding='utf-8') as f:
    story = json.load(f)

# Chapter 4 nodes
ch4_nodes = [
    {"id": "ch4_start", "type": "narrate", "text": "三年后。\n\n清晨的钟声依旧在天道宗外门回荡，悠长而低沉。三年前的少年如今已长成了沉稳的青年，眉宇间多了几分坚毅与锋芒。\n\n这三年里，云泽几乎没有睡过一个完整的觉。《云游心法》已修炼至第四重，修为也从当年的炼气初期突破到了炼气九层——这个速度，即便放在整个天道宗外门，都算得上凤毛麟角。\n\n演武场上，苏晴雨正等着他。三年过去，她已是外门弟子中公认的翘楚，修为达到炼气八层。\n\n\"云泽，你听说了吗？\"苏晴雨压低声音，\"三个月后就是九宗论剑，宗门要从外门选拔弟子参加新人组的比试。更重要的是——此次昆仑秘境的组队名单，也将从这次选拔中产生。\"", "scene": "天道宗·演武场", "next": "ch4_linjingyu_appear"},
    {"id": "ch4_linjingyu_appear", "type": "narrate", "text": "演武场另一侧，一道白衣身影负手而立——正是林惊羽。\n\n三年过去，他的气质愈发凌厉，周身的剑意几乎要割裂空气。筑基初期的修为，让他即便站在人群中，也如鹤立鸡群。\n\n他的目光扫过人群，最终落在云泽身上。\n\n\"云泽。\"林惊羽开口了，声音冷淡，\"三年不见，你的进境倒是不错。\"\n\n他走近几步，视线落在云泽腰间的游子剑上，眉头微皱：\"这柄剑……我越来越觉得它不简单。你当真只是从一本古籍中偶然习得？\"", "scene": "天道宗·演武场", "next": "ch4_choice_zhaoqiankun"},
    {"id": "ch4_choice_zhaoqiankun", "type": "choice", "prompt": "林惊羽对游子剑产生了怀疑。面对这个天才剑客的追问，你会如何应对？", "choices": [
        {"text": "坦诚相告：\"此剑来历，我也在探寻之中。\"", "effects": {"心性": 5, "缘": 5}, "next": "ch4_linjingyu_accept"},
        {"text": "避重就轻：\"不过是先师遗留，与寻常宝剑无异。\"", "effects": {"心性": -3}, "next": "ch4_linjingyu_suspect"}
    ]},
    {"id": "ch4_linjingyu_accept", "type": "dialogue", "speaker": "林惊羽", "text": "哦？你也不知道它的来历？\"林惊羽眉头微挑，\"此剑身上有太古年间的气息，远非寻常灵器可比。我父亲的遗物中有一本手札，记载过类似的东西……\n\n罢了，日后再说。三个月后的选拔，我会看着你的表现。", "emotion": "normal", "next": "ch4_zhaoqiankun_appear"},
    {"id": "ch4_linjingyu_suspect", "type": "dialogue", "speaker": "林惊羽", "text": "是吗？\"林惊羽淡淡地看了他一眼，没有追问，\"你比我想象的更懂得藏拙。这很好。\n\n只是有些事，藏得了一时，藏不了一世。", "emotion": "normal", "next": "ch4_zhaoqiankun_appear"},
    {"id": "ch4_zhaoqiankun_appear", "type": "narrate", "text": "\"哟，这不是咱们的天才云师弟吗？\"\n\n一道刺耳的声音从身后传来。云泽转过头，看见一个身着锦袍的青年正朝他走来——赵乾坤，宗门赵长老的侄子，在外门横行霸道多年。\n\n\"三年时间从炼气三层蹿到炼气九层？\"赵乾坤阴阳怪气，\"怕不是走了什么邪门歪道吧？这次选拔，我倒要看看你有什么本事！\"\n\n苏晴雨挡在云泽身前：\"赵乾坤，你最好收敛些。\"", "scene": "天道宗·演武场", "next": "ch4_zhao_conflict"},
    {"id": "ch4_zhao_conflict", "type": "narrate", "text": "赵乾坤冷笑一声：\"苏师姐，我劝你少管闲事。这外门，还轮不到你说话。\"\n\n他转向云泽，压低声音：\"昆仑秘境的名额，我赵家要定了。你若是识相，就老老实实待在宗门里修炼，别想着跟我抢。\"\n\n说完，他扬长而去。\n\n苏晴雨眉头紧皱：\"这个赵乾坤，向来睚眦必报。你要小心他暗中使绊子。\"", "scene": "天道宗·演武场", "next": "ch4_zhangxiaopang_reunion"},
    {"id": "ch4_zhangxiaopang_reunion", "type": "narrate", "text": "就在此时，一个熟悉的身影从人群中挤了过来——\n\n\"无咎哥！\"张小胖满头大汗地跑来，三年过去他依旧白白胖胖，只是身材又圆了一圈，\"俺可算找到你了！听说这次昆仑秘境，俺也有资格参加！\"\n\n张小胖已是炼气七层，体修小成，在外门也算出类拔萃。\n\n\"咱们又可以一起组队了！\"他咧嘴笑道，\"就像当年去天道宗那会儿一样！\"", "scene": "天道宗·演武场", "next": "ch4_selection_trial"},
    {"id": "ch4_selection_trial", "type": "narrate", "text": "选拔试炼在三日后举行。\n\n外门弟子中共有百余人参与角逐，最终只有三人能获得昆仑秘境的入场资格。\n\n试炼分为三轮：心性、悟性、实战。\n\n云泽一路过关斩将，心性测试中轻松通过问心阵，悟性测试中展现出对剑道的惊人理解。\n\n然而在实战环节，他的对手——正是赵乾坤。", "scene": "天道宗·演武场", "next": "ch4_vs_zhao"},
    {"id": "ch4_vs_zhao", "type": "narrate", "text": "\"云师弟，久仰大名。\"赵乾坤皮笑肉不笑，\"今日切磋，还请多多指教。\"\n\n他话音未落，身形已动！\n\n一出手便是杀招——《烈阳掌》，黄阶上品功法，掌风灼热如火！\n\n云泽侧身闪避，但赵乾坤早有预判，另一掌已朝他胸口拍来！\n\n\"砰——！\"云泽被震退三步，胸口一阵发闷。", "scene": "天道宗·演武场·擂台", "next": "ch4_choice_zhao_fight"},
    {"id": "ch4_choice_zhao_fight", "type": "choice", "prompt": "赵乾坤一出手便是杀招，意图在众目睽睽之下废掉你。你要如何应对？", "choices": [
        {"text": "施展游子剑第二式，正面压制他！", "effects": {"心性": 5, "修为": 5}, "next": "ch4_zhao_defeated_hard"},
        {"text": "以退为进，消耗他的真元，等待反击机会", "effects": {"心性": 10, "缘": 3}, "next": "ch4_zhao_defeated_smart"}
    ]},
    {"id": "ch4_zhao_defeated_hard", "type": "narrate", "text": "云泽不再藏拙，右手虚引，游子剑应声出鞘！\n\n\"游子九式，第二式——归乡难！\"\n\n剑芒化作漫天青影，如潮水般朝赵乾坤涌去。那是归乡的游子脚步匆匆，却步步杀机！\n\n赵乾坤脸色大变，连退数步，堪堪挡住这一剑。但云泽的剑势如虹，一剑接着一剑，根本不给他喘息之机。\n\n\"铛——！\"最后一剑架在他脖子上，冰凉的剑锋让他浑身僵硬。\n\n\"你……输了。\"云泽淡淡道。", "scene": "天道宗·演武场·擂台", "next": "ch4_trial_result"},
    {"id": "ch4_zhao_defeated_smart", "type": "narrate", "text": "云泽身形如风，在擂台上游走闪避，任凭赵乾坤如何狂攻，始终无法触及他分毫。\n\n十招……三十招……五十招……\n\n赵乾坤的真元在疯狂消耗，脸色越来越难看。反观云泽，呼吸平稳，神色从容。\n\n\"你……！\"赵乾坤终于意识到不对，想要改变战术，但已经来不及了。\n\n云泽身形一闪，绕到他身后，一掌拍在他后背。赵乾坤踉跄几步，险些跌落擂台。\n\n\"承让。\"云泽收掌而立。", "scene": "天道宗·演武场·擂台", "next": "ch4_trial_result"},
    {"id": "ch4_trial_result", "type": "narrate", "text": "选拔试炼结束。\n\n云泽以第一名的成绩，毫无悬念地拿到了昆仑秘境的入场资格。\n\n张小胖凭借一身蛮力挤进前三。苏晴雨因是女修身份，获得了特别推荐。\n\n赵乾坤虽然落败，但因为其叔父赵长老的关系，还是拿到了最后一个名额。\n\n\"三个月后，昆仑秘境见。\"苏晴雨望着云泽，\"到时候，我们一起组队。\"\n\n云泽点了点头。\n\n昆仑秘境……那里面，究竟藏着什么秘密？", "scene": "天道宗·演武场", "next": "ch4_linjingyu_warning"},
    {"id": "ch4_linjingyu_warning", "type": "dialogue", "speaker": "林惊羽", "text": "林惊羽在人群散去后，悄然来到云泽身边。\n\n\"你的剑……我越来越确定了。\"他压低声音，\"那柄剑，与我林家有一段渊源。昆仑秘境中，或许藏着你要的答案。\"\n\n\"但你要小心——秘境深处，危险重重。赵乾坤不会善罢甘休，秘境中没有人管束……\"\n\n他顿了顿：\"还有，别相信你师父告诉你的所有事。\"", "emotion": "nervous", "next": "ch4_end"},
    {"id": "ch4_end", "type": "end", "ending": "ch4_complete", "title": "第四章·完", "summary": "三年苦修，云泽修为精进，却也因此惹上了赵乾坤的记恨。九宗论剑选拔在即，昆仑秘境名额之争尘埃落定。林惊羽的出现带来了新的疑团——游子剑的来历，远比想象中更加惊人……"}
]

# Chapter 5 nodes
ch5_nodes = [
    {"id": "ch5_start", "type": "narrate", "text": "三个月后。\n\n昆仑秘境入口。\n\n巍峨的山门矗立在云雾之中，山门上刻着四个苍劲大字——\"昆仑秘境\"。山门两侧，各有一尊上古凶兽石雕，威严肃穆。\n\n云泽、苏晴雨、张小胖站在队伍前列。他们身后，还有其他宗门的弟子——此次昆仑秘境试炼，由天道宗、玄清宗、凌云阁三宗联合举办。\n\n\"都准备好了吗？\"苏晴雨低声问道。", "scene": "昆仑秘境·入口", "next": "ch5_team_formation"},
    {"id": "ch5_team_formation", "type": "narrate", "text": "队伍中，还有一道显眼的身影——林惊羽。\n\n作为内门弟子，林惊羽本可直接进入秘境深处，但他说要\"看看这届外门弟子的成色\"，主动加入了云泽的队伍。\n\n\"昆仑秘境分三层。\"林惊羽淡淡道，\"外层是灵草妖兽，中层是上古遗迹，内层……\"\n\n他顿了顿：\"内层从未有人活着走出来过。你们的目标，是中层，活着回来。\"\n\n云泽握紧游子剑，目光坚定。", "scene": "昆仑秘境·入口", "next": "ch5_enter_secret"},
    {"id": "ch5_enter_secret", "type": "narrate", "text": "秘境入口的光芒将众人吞没。\n\n当云泽再次睁开眼时，已身处一片莽莽密林之中。古木参天，灵雾缭绕，空气中弥漫着浓郁的灵气。\n\n\"这里灵气浓度，是外界的十倍不止。\"苏晴雨惊叹道。\n\n就在此时，云泽忽然感到怀中一阵灼热——那枚刻着\"道\"字的玉佩，正隐隐发光！\n\n仿佛有什么东西，在前方召唤着他……", "scene": "昆仑秘境·密林", "next": "ch5_choice_direction"},
    {"id": "ch5_choice_direction", "type": "choice", "prompt": "玉佩的异常反应说明前方有重要机缘。你会怎么做？", "choices": [
        {"text": "跟随玉佩的指引，独自前往探索", "effects": {"缘": 15, "修为": 5}, "next": "ch5_follow_jade"},
        {"text": "与队伍一起按计划行动，安全为上", "effects": {"心性": 8}, "next": "ch5_follow_team"}
    ]},
    {"id": "ch5_follow_jade", "type": "narrate", "text": "\"你们先走，我有点事。\"\n\n云泽留下这句话，便朝着玉佩指引的方向飞掠而去。穿过密林，绕过妖兽领地，他来到一处隐蔽的山壁前。\n\n玉佩的光芒忽然大盛，山壁上的岩石竟自行移开，露出一条幽深的暗道。\n\n云泽深吸一口气，踏入了暗道之中。\n\n暗道尽头，是一间尘封的石室。", "scene": "昆仑秘境·古洞", "next": "ch5_memory_fragment"},
    {"id": "ch5_follow_team", "type": "narrate", "text": "云泽压下心中的异样，与队伍一同深入秘境。\n\n然而走了不过半日，他们便遭遇了伏击——赵乾坤带着几个陌生人，拦在了他们面前。\n\n\"云师弟，昆仑秘境凶险万分，出点意外在所难免。\"赵乾坤冷笑，\"给我上！\"\n\n混战之中，云泽被逼入一处山洞。洞中深处，一枚发光的玉简静静躺在石台上——那是云游子留下的记忆碎片！\n\n他颤抖着伸出手，触碰那枚玉简……", "scene": "昆仑秘境·古洞", "next": "ch5_memory_fragment"},
    {"id": "ch5_memory_fragment", "type": "narrate", "text": "玉简触手的瞬间，一道光芒将云泽的意识卷入了一片幻境之中。\n\n他看见了一个年轻的男子——那正是云游子。\n\n幻境中，云游子正与一个白发老者激战。那老者身着金边紫袍，面容与天璇真人有七分相似——不，他就是年轻时的天璇真人！\n\n\"师弟，回头吧！\"云游子的声音在幻境中回荡，\"你我师出同门，何至于此！\"\n\n\"师兄，\"天璇真人的声音冰冷，\"你发现了不该发现的东西。天道图的秘密，不能让外人知道。\"", "scene": "云游子·记忆碎片", "next": "ch5_memory_reveal"},
    {"id": "ch5_memory_reveal", "type": "narrate", "text": "记忆碎片中的画面如潮水般涌来——\n\n云游子被围攻，身受重伤，逃至青云镇后山。\n\n天璇真人站在追兵之中，手中长剑染血。\n\n\"师兄，天道图碎片就在你体内。只要你交出来，我可以饶你一命。\"\n\n\"天道图是上古至宝，蕴含天道本源。\"云游子惨笑，\"你想用它做什么？\"\n\n天璇真人沉默良久。\n\n\"……我要用它，取代天道。\"\n\n云泽的脑海中轰然炸响！", "scene": "云游子·记忆碎片", "next": "ch5_truth_shock"},
    {"id": "ch5_truth_shock", "type": "narrate", "text": "真相如惊雷般在云泽脑海中炸开。\n\n天璇真人——他拜入门下的师父，三百年前追杀云游子的凶手！\n\n他修炼的《云游心法》是云游子的传承，而传授他这套功法的人，正是云游子的仇人！\n\n\"原来……\"云泽浑身颤抖，\"我修炼的每一步，都是踏在云游子的尸骨上……\"\n\n玉简中又传来云游子最后的声音：\n\n\"有缘人，无论你是谁……替我，揭开真相……\"", "scene": "云游子·记忆碎片", "next": "ch5_choice_truth"},
    {"id": "ch5_choice_truth", "type": "choice", "prompt": "云游子的记忆揭露了惊天真相——天璇真人就是当年追杀他的仇人。你要如何面对这一切？", "choices": [
        {"text": "接受真相，但选择不复仇——仇恨只会让你迷失", "effects": {"心性": 20, "缘": 10}, "flags": {"forgive_tianxuan": True}, "next": "ch5_forgive"},
        {"text": "绝不原谅——若有机会，定要当面质问天璇真人！", "effects": {"心性": -10, "修为": 5}, "flags": {"seek_revenge": True}, "next": "ch5_revenge_path"}
    ]},
    {"id": "ch5_forgive", "type": "narrate", "text": "云泽深吸一口气，强行压下心中的怒火与悲痛。\n\n\"前辈……我不会让仇恨吞噬自己。\"他在心中默默说道，\"但真相必须大白于天下。三百年的冤屈，不能就这样被埋葬。\"\n\n他从记忆中退出，手中多了一枚温热的玉简——那是云游子留下的第二份传承。\n\n\"小家伙……谢谢你没有迷失。\"云游子的声音最后一次响起，\"记住，天璇……他也有他的苦衷……\"\n\n声音渐渐消散。", "scene": "昆仑秘境·古洞", "next": "ch5_back_team"},
    {"id": "ch5_revenge_path", "type": "narrate", "text": "云泽的眼中燃烧着怒火。\n\n天璇真人……养育教导之恩，在这一刻变得如此讽刺。\n\n\"师尊……\"他的声音冰冷，\"你欠云游子前辈的，欠我的，终究要还。\"\n\n他从记忆中退出，手中紧握着那枚玉简。玉简中记载着云游子最后的叮嘱——以及一段通往天道图碎片的线索。\n\n\"云游子前辈，您放心。真相……我会揭开。\"", "scene": "昆仑秘境·古洞", "next": "ch5_back_team"},
    {"id": "ch5_back_team", "type": "narrate", "text": "云泽从古洞中走出，迎面遇上了焦急等待的苏晴雨和张小胖。\n\n\"云泽！你没事吧？\"苏晴雨上前一步，\"我们跟丢了赵乾坤的人，正担心你……\"\n\n云泽望着她，一时间百感交集。\n\n\"没事。\"他深吸一口气，\"只是……看到了一些不该看到的东西。\"\n\n林惊羽走上前来，目光落在他手中的玉简上，若有所思。\n\n\"找到了？\"", "scene": "昆仑秘境·密林", "next": "ch5_secret_share"},
    {"id": "ch5_secret_share", "type": "choice", "prompt": "林惊羽似乎知道些什么。他问\"找到了？\"——你是否要向他透露真相？", "choices": [
        {"text": "告诉他——他的父亲之死，可能也与天璇真人有关", "effects": {"缘": 15}, "flags": {"trust_linjingyu": True}, "next": "ch5_linjingyu_alliance"},
        {"text": "沉默——真相太过沉重，不能轻易示人", "effects": {"心性": 5}, "next": "ch5_keep_secret"}
    ]},
    {"id": "ch5_linjingyu_alliance", "type": "dialogue", "speaker": "林惊羽", "text": "林惊羽听完云泽的讲述，面色剧变。\n\n\"原来如此……\"他的声音低沉，\"我父亲当年……原来也是因为知道了这些秘密，才被灭口的。\"\n\n他猛然转身，眼中闪烁着刻骨的恨意：\"天璇真人……不，天玄子！我林家与他势不两立！\"\n\n他望向云泽：\"从今往后，你我联手。天道宗的黑暗，终有一日会被揭开！\"", "emotion": "angry", "next": "ch5_trial_end"},
    {"id": "ch5_keep_secret", "type": "narrate", "text": "云泽摇了摇头，没有说话。\n\n林惊羽没有追问，只是深深地看了他一眼。\n\n\"我父亲的手札里记载过一些事。\"他忽然开口，\"二十年前，有一位叫云游子的天才弟子失踪了。而我的父亲，也是在同一时期……\"\n\n他没有说完，但意思已经很明显了。\n\n\"昆仑秘境深处，或许还有更多线索。\"林惊羽转身，\"走吧，时辰不等人。\"", "scene": "昆仑秘境·密林", "next": "ch5_trial_end"},
    {"id": "ch5_trial_end", "type": "end", "ending": "ch5_complete", "title": "第五章·完", "summary": "昆仑秘境中，云泽发现了云游子留下的记忆碎片。三百年前的惊天真相浮出水面——天璇真人，正是当年追杀云游子的凶手！原来收他为徒，不过是为了找到云游子的传承……云泽面临人生中最艰难的抉择。"}
]

# Chapter 6 nodes
ch6_nodes = [
    {"id": "ch6_start", "type": "narrate", "text": "又是三年后。\n\n云泽已从炼气境突破至筑基初期，正式成为天道宗内门弟子。\n\n这三年里，他将云游子的传承与自身领悟融会贯通，剑道修为突飞猛进。游子九式已能施展到第五式，实力之强，即便在内门中也鲜有对手。\n\n而今日——九宗论剑，终于到来。\n\n云顶天宫之上，九大宗门的精英弟子齐聚一堂。", "scene": "天道宗·云顶天宫", "next": "ch6_nine_sects"},
    {"id": "ch6_nine_sects", "type": "narrate", "text": "云顶天宫巍峨耸立，九根玉柱撑起穹顶，柱身上刻满了九大宗门的徽记。\n\n\"天道宗、玄清宗、凌云阁、紫霄派、青云门……\"张小胖在一旁掰着指头数，\"俺还是头一回见这么多大门派的弟子！\"\n\n苏晴雨的神情却有些凝重：\"九宗论剑，表面是切磋，实际上是各方势力的角力。每一届都有弟子在比试中伤残，甚至……\"\n\n她没有说下去。", "scene": "天道宗·云顶天宫", "next": "ch6_linjingyu_final"},
    {"id": "ch6_linjingyu_final", "type": "narrate", "text": "经过数轮角逐，新人组的决赛名单出炉——\n\n天道宗·云泽。\n东州·林惊羽。\n\n全场哗然。\n\n林惊羽是东州林家剑道天才，十六岁筑基，如今已是筑基后期，实力深不可测。而云泽虽然进境迅速，但与林惊羽相比，似乎还有不小差距。\n\n\"这一战，你有多少把握？\"苏晴雨低声问道。\n\n云泽望着擂台对面那道白衣身影，缓缓道：\"五成。\"", "scene": "天道宗·云顶天宫·决赛擂台", "next": "ch6_clash_start"},
    {"id": "ch6_clash_start", "type": "narrate", "text": "决赛开始。\n\n林惊羽一出手便是林家绝学——\"天外飞仙剑诀\"！\n\n剑光如虹，化作一道白色惊鸿，从天外飞来，直取云泽眉心！\n\n那是太快、太凌厉的一剑！\n\n但云泽早有准备。游子剑出鞘，游子九式第五式\"孤雁回\"迎了上去——\n\n\"铛——！\"\n\n两剑相交，迸发出震耳欲聋的轰鸣。", "scene": "天道宗·云顶天宫·决赛擂台", "next": "ch6_epic_battle"},
    {"id": "ch6_epic_battle", "type": "narrate", "text": "惊天一剑！\n\n林惊羽的剑越来越快，每一剑都直指要害。云泽节节败退，却始终没有被击溃。\n\n\"好！\"林惊羽眼中闪过一丝兴奋，\"这才是我要的对手！\"\n\n他剑势一变，使出了天外飞仙剑诀的终极奥义——\"飞仙斩\"！\n\n一道璀璨至极的剑芒横贯长空，仿佛要将天地斩开！\n\n云泽瞳孔紧缩。这一剑，他必须做出选择！", "scene": "天道宗·云顶天宫·决赛擂台", "next": "ch6_choice_battle"},
    {"id": "ch6_choice_battle", "type": "choice", "prompt": "林惊羽的飞仙斩威力惊人，正面硬接必败无疑。你要如何应对这决定胜负的一剑？", "choices": [
        {"text": "以攻代守！用游子九式第六式\"故园梦\"与他对攻！", "effects": {"心性": 10, "修为": 8}, "flags": {"win_battle": True}, "next": "ch6_win_narrow"},
        {"text": "以柔克刚！借力打力，化解这一剑的锋芒！", "effects": {"心性": 15, "缘": 5}, "flags": {"draw_battle": True}, "next": "ch6_draw_narrow"}
    ]},
    {"id": "ch6_win_narrow", "type": "narrate", "text": "云泽猛然踏前一步，游子剑化作漫天剑影！\n\n\"游子九式，第六式——故园梦！\"\n\n那是归乡的游子梦中挥出的一剑，剑势如潮，剑意如海。剑影中仿佛藏着一整个故乡的思念，将敌人的攻击尽数吞没！\n\n\"铛——！！\"\n\n一声巨响，林惊羽的长剑被震飞！\n\n全场寂静，而后爆发出雷鸣般的欢呼！\n\n\"云泽胜！\"", "scene": "天道宗·云顶天宫·决赛擂台", "next": "ch6_liwuxin_appear"},
    {"id": "ch6_draw_narrow", "type": "narrate", "text": "云泽没有硬接，而是身形一转，以柔劲引偏了那一剑的轨迹。\n\n林惊羽的剑芒从他身侧掠过，斩在擂台边缘，硬生生削掉了一角！\n\n\"你……\"林惊羽瞳孔紧缩。\n\n云泽的游子剑已架在了他脖子上。\n\n\"承让。\"云泽淡淡道。\n\n全场哗然。林惊羽竟然输了？虽然只是险胜，但云泽的名字，已传遍九宗！", "scene": "天道宗·云顶天宫·决赛擂台", "next": "ch6_liwuxin_appear"},
    {"id": "ch6_liwuxin_appear", "type": "narrate", "text": "比试结束后，云泽正在场边休息。\n\n一道身影忽然出现在他面前——那是一个黑衣青年，周身萦绕着淡淡的黑气，眼神阴鸷而锐利。\n\n\"你就是云泽？\"那青年嘴角勾起一丝玩味的笑意，\"有意思。天道宗的小绵羊，竟然藏着这么大的秘密。\"\n\n\"你是谁？\"云泽警惕道。\n\n\"在下厉无心。\"青年拱手，\"天魔教少主。\"", "scene": "天道宗·云顶天宫", "next": "ch6_liwuxin_secret"},
    {"id": "ch6_liwuxin_secret", "type": "dialogue", "speaker": "厉无心", "text": "厉无心凑近云泽耳边，压低声音：\"云师弟，你知道为什么天道宗能成为九宗之首吗？\"\n\n\"因为三百年前，他们背叛了饕餮。\"\n\n云泽心中一震。\n\n\"天道宗开派祖师天玄子，当年勾结外敌，背叛了守护天道的饕餮，将它封印。这才换来了天道宗的崛起。\"\n\n厉无心冷笑：\"而你们口中的'魔教'——天魔教，其实是为当年被陷害的先祖复仇。正邪？呵……\"", "emotion": "nervous", "next": "ch6_choice_evil"},
    {"id": "ch6_choice_evil", "type": "choice", "prompt": "厉无心揭露了天道宗的黑历史，声称天魔教才是正义的一方。你会如何回应？", "choices": [
        {"text": "听完他的讲述，保留判断——正邪未定，不能只听一家之言", "effects": {"心性": 10, "缘": 10}, "flags": {"trust_liwuxin": True}, "next": "ch6_investigate"},
        {"text": "冷笑拒绝——天魔教行事狠辣，不值得相信", "effects": {"心性": 5}, "next": "ch6_reject_liwuxin"}
    ]},
    {"id": "ch6_investigate", "type": "narrate", "text": "\"你说的话，我会记住。\"云泽淡淡道，\"但我不会轻易相信任何人。\"\n\n厉无心哈哈大笑：\"聪明！我喜欢和聪明人打交道。\"\n\n他从袖中取出一枚玉牌，递给云泽：\"这是天魔教的令牌。日后若有需要，可凭此物来天魔教找我。\"\n\n\"饕餮的封印已经松动。天道宗的报应，快来了。\"\n\n说完，他飘然而去。", "scene": "天道宗·云顶天宫", "next": "ch6_end"},
    {"id": "ch6_reject_liwuxin", "type": "narrate", "text": "\"正邪自有公论。\"云泽冷声道，\"天魔教的手上沾了多少无辜者的血，你们自己清楚。\"\n\n厉无心耸了耸肩：\"信不信由你。但云师弟，饕餮一旦苏醒，天道宗必亡。到时候，你我或许还会再见。\"\n\n他转身离去，留下一句意味深长的话：\n\n\"记住我的话——没有绝对的正邪，只有立场的不同。\"", "scene": "天道宗·云顶天宫", "next": "ch6_end"},
    {"id": "ch6_end", "type": "end", "ending": "ch6_complete", "title": "第六章·完", "summary": "九宗论剑决赛，云泽与林惊羽的惊天一战传遍修真界。天魔教少主厉无心突然现身，揭露了天道宗三百年前的惊天黑幕——天玄子背叛饕餮，才换来了天道宗的崛起。云泽在这场漩涡中，该如何抉择？"}
]

# Chapter 7 nodes
ch7_nodes = [
    {"id": "ch7_start", "type": "narrate", "text": "半年后。\n\n昆仑虚深处，上古封印开始龟裂。\n\n一股恐怖的魔气从裂缝中渗透而出，所过之处，生灵涂炭。修真界为之震动——饕餮的封印，正在松动！\n\n天道宗紧急召开九宗会议。\n\n\"饕餮若苏醒，三界将陷入浩劫。\"天璇真人面色凝重，\"必须组成联军，攻打昆仑虚封印裂缝！\"", "scene": "天道宗·议事大殿", "next": "ch7_alliance"},
    {"id": "ch7_alliance", "type": "narrate", "text": "出乎所有人意料的是——天魔教也派人参加了会议。\n\n\"饕餮是我们的先祖。\"厉无心站在大殿之中，面对九宗代表，\"我们不会坐视它被天玄子留下的封印毁灭。\"\n\n\"你们想要什么？\"天道宗长老喝问。\n\n\"解开真相。\"厉无心冷笑，\"三百年了，世人该知道，当年到底是谁背叛了谁。\"\n\n大殿中一片哗然。", "scene": "天道宗·议事大殿", "next": "ch7_kunlun_battle"},
    {"id": "ch7_kunlun_battle", "type": "narrate", "text": "正魔两道的临时联军，朝昆仑虚进发。\n\n云泽也在这支队伍之中。他已是筑基巅峰的修为，实力仅次于各宗长老。\n\n昆仑虚深处，那道巨大的裂缝出现在众人眼前。裂缝中涌出的魔气浓郁得几乎凝成实质，让人喘不过气来。\n\n\"进攻！\"各宗长老同时出手，璀璨的法术朝裂缝轰去！", "scene": "昆仑虚·封印裂缝", "next": "ch7_taotie_awaken"},
    {"id": "ch7_taotie_awaken", "type": "narrate", "text": "就在众人围攻裂缝之时，一只巨大的爪子从裂缝中伸出！\n\n那爪子漆黑如墨，遮天蔽日，一爪拍下，便有数位修士化为血雾！\n\n\"饕餮！\"有人惊恐尖叫。\n\n紧接着，一道庞大的身影从裂缝中缓缓升起——那是一头上古凶兽，羊身人面，目在腋下，正是饕餮！\n\n饕餮的双眼扫过战场，最终落在了云泽身上。\n\n\"……你……\"", "scene": "昆仑虚·封印裂缝", "next": "ch7_taotie_recognize"},
    {"id": "ch7_taotie_recognize", "type": "dialogue", "speaker": "饕餮", "text": "饕餮的庞大头颅低垂下来，那双可怕的眼睛死死盯着云泽。\n\n\"云游子……不。\"\n\n它的声音如雷鸣般在云泽脑海中炸响：\n\n\"你是……道君？！\"\n\n全场震惊！\n\n\"道君？！\"无数人惊呼出声，\"那个道君？！\"\n\n云泽自己也愣住了——道君？他在说什么？", "emotion": "shock", "next": "ch7_choice_taotie"},
    {"id": "ch7_choice_taotie", "type": "choice", "prompt": "饕餮竟称呼你为\"道君\"！这是什么意思？你要如何回应这头远古凶兽？", "choices": [
        {"text": "直面饕餮：\"道君是谁？我不明白你在说什么！\"", "effects": {"心性": 10, "缘": 5}, "next": "ch7_taotie_reveal"},
        {"text": "保持警惕：\"你认错人了。我只是天道宗弟子云泽。\"", "effects": {"心性": -5}, "next": "ch7_taotie_reveal"}
    ]},
    {"id": "ch7_taotie_reveal", "type": "dialogue", "speaker": "饕餮", "text": "饕餮发出一阵低沉的笑声，那笑声中透着无尽的苍凉与悲愤。\n\n\"认错？哈……我等了三百年，怎么会认错！\"\n\n\"道君，你当年与我并肩作战，封印天玄子的叛乱。如今，你转世归来，忘却了前世……\"\n\n它的声音忽然变得柔和：\"但没关系。吾能感知到你体内的道君印记——那是当年你留下的最后凭证。\"\n\n\"你……终将想起一切。\"", "emotion": "sad", "next": "ch7_tianxuan_self_seal"},
    {"id": "ch7_tianxuan_self_seal", "type": "narrate", "text": "就在此时，一道身影掠空而至——是天璇真人！\n\n\"云泽，退后！\"\n\n天璇真人的身形挡在了云泽面前，面对着饕餮。\n\n\"饕餮，今日你我做个了断！\"\n\n他的周身忽然爆发出耀眼的光芒，那是化神境的全部修为！他竟要以自身为媒介，将饕餮重新封印！\n\n\"师父！\"云泽惊呼。", "scene": "昆仑虚·封印裂缝", "next": "ch7_tianxuan_sacrifice"},
    {"id": "ch7_tianxuan_sacrifice", "type": "dialogue", "speaker": "天璇真人", "text": "天璇真人回头，望向云泽，眼中满是复杂的情绪。\n\n\"云泽……三百年前，我对不起师兄。三百年后，我不能再对不起你。\"\n\n\"饕餮的真相，去证道遗迹寻找答案。你体内有道君的印记……那是天玄子最害怕的东西。\"\n\n他的声音越来越虚弱：\"替我……把真相告诉世人……还有……小心天玄子……\"\n\n光芒大盛，天璇真人化作一道光柱，朝饕餮冲去！", "emotion": "sad", "next": "ch7_tianxuan_death"},
    {"id": "ch7_tianxuan_death", "type": "narrate", "text": "一声惊天动地的轰鸣。\n\n天璇真人的肉身化作封印之力，与饕餮的力量对撞。饕餮发出一声怒吼，被重新压回裂缝之中。\n\n而天璇真人……就这样消散在了天地之间。\n\n云泽跪在地上，望着师父消失的方向。\n\n那个欺骗过他、教导过他、最终为他而死的男人……就这样走了。\n\n\"师父……\"他的声音沙哑。", "scene": "昆仑虚·封印裂缝", "next": "ch7_aftermath"},
    {"id": "ch7_aftermath", "type": "narrate", "text": "战后，天璇真人自我封印的消息传遍了修真界。\n\n有人说他是英雄，舍身取义，镇压饕餮；有人说他是一代枭雄，死得其所。\n\n只有云泽知道真相。\n\n他站在天璇峰的废墟前，手中握着天璇真人临终前交给他的令牌——那令牌中，蕴含着天璇真人全部的传承，以及通往证道遗迹的线索。\n\n\"师父……我会完成您的遗愿。\"", "scene": "天道宗·天璇峰废墟", "next": "ch7_choice_path"},
    {"id": "ch7_choice_path", "type": "choice", "prompt": "天璇真人已逝，他临终前将通往证道遗迹的线索交给你。你接下来要怎么做？", "choices": [
        {"text": "立刻前往证道遗迹，追寻道君传承和全部真相", "effects": {"缘": 20, "修为": 10}, "flags": {"seek_truth": True}, "next": "ch7_end"},
        {"text": "留在天道宗，暗中调查天玄子，等待时机", "effects": {"心性": 10}, "flags": {"wait_and_see": True}, "next": "ch7_end"}
    ]},
    {"id": "ch7_end", "type": "end", "ending": "ch7_complete", "title": "第七章·完", "summary": "昆仑虚之战，饕餮觉醒，认出云泽是道君转世。天璇真人在关键时刻自我封印，将全部传承与证道遗迹的线索托付给云泽后，消散于天地之间。云泽的道君身份之谜，即将揭晓……"}
]

# Chapter 8 nodes
ch8_nodes = [
    {"id": "ch8_start", "type": "narrate", "text": "证道遗迹。\n\n那是位于昆仑虚最深处的神秘所在，相传是上古大能\"道君\"的修行之地。\n\n云泽独自站在遗迹入口前。遗迹的石门上刻着四个古朴的大字——\"道法自然\"。\n\n他深吸一口气，推开了石门。\n\n石门之后，是一条漫长的甬道。甬道两侧的墙壁上，刻满了密密麻麻的符文，散发着幽幽的光芒。", "scene": "证道遗迹·入口", "next": "ch8_daoist_hall"},
    {"id": "ch8_daoist_hall", "type": "narrate", "text": "甬道尽头，是一座宏伟的大殿。\n\n大殿中央，供奉着一尊雕像——那是一个身着道袍的男子，面容与云泽有七分相似。\n\n雕像前，放着一枚玉简和一枚玉佩。\n\n那玉佩……正是云泽自幼佩戴的那枚刻着\"道\"字的玉佩！\n\n\"这是……\"云泽浑身一震。", "scene": "证道遗迹·大殿", "next": "ch8_inheritance"},
    {"id": "ch8_inheritance", "type": "dialogue", "speaker": "道君（虚幻投影）", "text": "就在此时，一道虚幻的身影从雕像中缓缓浮现。\n\n那身影身着道袍，气质出尘，周身萦绕着淡淡的道韵。\n\n\"你终于来了。\"\n\n道君的投影望向云泽，眼中满是欣慰：\"我的转世……我的传承者。\"\n\n\"我是第八纪元的道君，世人称我'无名道君'。三百年前，我参与了封印饕餮的行动，却遭天玄子背叛，陨落转世。\"\n\n\"而你——就是我。\"", "emotion": "normal", "next": "ch8_identity_confirmed"},
    {"id": "ch8_identity_confirmed", "type": "narrate", "text": "道君的投影抬起手，一道光芒射入云泽眉心。\n\n刹那间，滔天的记忆洪流涌入云泽脑海——\n\n他看见了太古年间，道君与饕餮并肩作战，镇压天玄子叛乱的场景；\n\n他看见了第八纪元末，道君陨落、转世重生的悲壮一幕；\n\n他更看见了——天道本源的真相。\n\n\"遁去的一……\"道君的声音回荡在大殿中，\"天衍四九，遁去其一。我，便是那遁去的一。\"", "scene": "证道遗迹·大殿", "next": "ch8_choice_identity"},
    {"id": "ch8_choice_identity", "type": "choice", "prompt": "道君的身份得到确认——你就是\"遁去的一\"，九纪元以来唯一的变数。你要如何面对这份传承？", "choices": [
        {"text": "接受传承——无论代价是什么，我都要变得更强！", "effects": {"修为": 30, "心性": 10, "缘": 15}, "flags": {"accept_daojun": True}, "next": "ch8_accept_inheritance"},
        {"text": "暂不接受——我需要更多时间消化这些信息", "effects": {"心性": -5}, "flags": {"decline_daojun": True}, "next": "ch8_decline_inheritance"}
    ]},
    {"id": "ch8_accept_inheritance", "type": "narrate", "text": "云泽伸出手，触碰那枚玉简。\n\n玉简中的传承如潮水般涌入他体内——那是道君毕生的修为感悟，是\"遁去的一\"的核心奥义，是打破天道轮回的关键所在！\n\n剧痛传来。\n\n云泽感觉自己的经脉在被撕裂、重塑，再撕裂、再重塑……\n\n不知过了多久，他终于从痛苦中醒来。\n\n他感觉……前所未有的强大。", "scene": "证道遗迹·大殿", "next": "ch8_power_awakened"},
    {"id": "ch8_decline_inheritance", "type": "narrate", "text": "云泽收回手，后退一步。\n\n\"这份传承……太沉重了。\"他低声道。\n\n道君的投影微微叹息：\"也罢。时势未到，揠苗助长只会适得其反。\"\n\n\"但你要记住——你是变数，是打破轮回的关键。无论接受与否，这份使命都落在你肩上。\"\n\n\"去吧。去寻找属于你自己的道。\"\n\n光芒消散，道君的投影也渐渐隐去。", "scene": "证道遗迹·大殿", "next": "ch8_power_awakened"},
    {"id": "ch8_power_awakened", "type": "narrate", "text": "云泽走出证道遗迹。\n\n他的眼神已经不同了。\n\n炼虚境。\n\n接受了道君传承之后，他的修为从化神境直接跃升至炼虚境——这个速度，堪称前无古人。\n\n\"遁去的一……\"他低头望着自己的双手，\"原来这就是我的命运。\"\n\n天玄子。三百年前的背叛者。天道宗真正的幕后黑手。\n\n\"等着吧。\"他的声音冰冷，\"这笔账，我会来清算。\"", "scene": "证道遗迹·出口", "next": "ch8_end"},
    {"id": "ch8_end", "type": "end", "ending": "ch8_complete", "title": "第八章·完", "summary": "云泽进入证道遗迹，接受了道君传承。前世记忆觉醒，他终于知道自己就是第八纪元陨落的道君转世——\"遁去的一\"，九纪元以来唯一的变数。修为突破至炼虚境，与天玄子的最终对决，即将到来……"}
]

# Chapter 9 nodes
ch9_nodes = [
    {"id": "ch9_start", "type": "narrate", "text": "三年后。\n\n饕餮的封印再次松动，这一次，比以往任何一次都要猛烈。\n\n天玄子终于现身了。\n\n那是一个白发白袍的老者，周身萦绕着天道本源的气息，仅仅是站在那里，便让整片天地都为之颤抖。\n\n\"遁去的一……\"天玄子望向云泽，嘴角浮现一丝冷笑，\"我等这一天，已经等了很久了。\"", "scene": "昆仑虚·天道本源", "next": "ch9_tianxuanzi_appear"},
    {"id": "ch9_tianxuanzi_appear", "type": "dialogue", "speaker": "天玄子", "text": "天玄子负手而立，俯视着云泽。\n\n\"你以为你是谁？道君的转世？哈……可笑。\"\n\n\"三百年前，道君与我争夺天道本源的控制权。他输了，陨落转世。\"\n\n\"而你，不过是他留下的一枚棋子。等你集齐天道图，我便可借此彻底炼化天道本源，成为新的天道！\"\n\n他伸出手，天空中出现了一幅虚幻的天道图——那是云泽一直在追寻的东西。", "emotion": "angry", "next": "ch9_final_battle"},
    {"id": "ch9_final_battle", "type": "narrate", "text": "最终决战爆发。\n\n云泽独自面对天玄子，而饕餮则被各宗联军勉强压制。\n\n这是一场跨越九纪元的因果清算。\n\n天玄子的实力超越了混元境，远非云泽所能正面抗衡。但云泽体内有\"遁去的一\"的力量——那是天道的变数，是打破轮回的关键。\n\n\"天玄子！\"云泽怒吼，\"你作恶多端，今日便是你的末日！\"", "scene": "昆仑虚·天道本源", "next": "ch9_battle_result"},
    {"id": "ch9_battle_result", "type": "narrate", "text": "就在云泽与天玄子激战的关键时刻，厉无心从侧翼杀出！\n\n\"天玄子！纳命来！\"\n\n厉无心的匕首刺入天玄子后背，打破了他的防御节奏！\n\n与此同时，饕餮的意识与云泽产生了共鸣：\"道君，我来助你！\"\n\n饕餮将自己最后的力量灌注入云泽体内——那是天道清道夫的原始力量！\n\n\"不——！\"天玄子发出绝望的嘶吼。", "scene": "昆仑虚·天道本源", "next": "ch9_final_choice"},
    {"id": "ch9_final_choice", "type": "choice", "prompt": "天玄子被击败，天道本源的大门向你敞开。你面前出现了三条路——", "choices": [
        {"text": "取代天道——成为新的天道主宰，以绝对的力量守护苍生", "effects": {"心性": 10}, "flags": {"ending_path": "tiandao_dominate"}, "next": "ch9_ending_1"},
        {"text": "与道合一——融入天道本源，放弃个体意识，成为天道的一部分", "effects": {"心性": -5}, "flags": {"ending_path": "dadao_merge"}, "next": "ch9_ending_2"},
        {"text": "超脱轮回——以\"遁去的一\"打破天道枷锁，开创新纪元", "effects": {"心性": 20, "缘": 20}, "flags": {"ending_path": "transcend"}, "next": "ch9_ending_3"}
    ]},
    {"id": "ch9_ending_1", "type": "narrate", "text": "云泽踏入天道本源之地，接受了天道的加冕。\n\n他成为了新的天道主宰，凌驾于三界之上。\n\n在他的治理下，三界安宁，众生平等，再无纷争。\n\n但代价是——他失去了所有羁绊。林惊羽、苏晴雨、厉无心……他们都不记得他了。他成为了孤独的天道，永远高高在上，再也无法回到人间。\n\n这是他的选择。也是他的宿命。", "scene": "天道本源之地", "next": "ch9_ending_1_end"},
    {"id": "ch9_ending_1_end", "type": "end", "ending": "ending_tiandao_dominate", "title": "结局一·天道独尊", "summary": "你成为新的天道主宰，以绝对的力量守护三界。然而天道无情，你失去了所有羁绊，成为永恒的孤独者。这是强者的代价，也是天道的宿命。"},
    {"id": "ch9_ending_2", "type": "narrate", "text": "云泽选择融入天道本源。\n\n他的意识渐渐消散，与天道合而为一。\n\n他成为了天道的一部分，不再是云泽，也不再是道君。他化作了天地间的规则，运行不息，永不消逝。\n\n但这真的是\"活着\"吗？\n\n没有人知道。\n\n只是在三界之中，偶尔会有人听到一个声音：\"道法自然，无为而治……\"", "scene": "天道本源之地", "next": "ch9_ending_2_end"},
    {"id": "ch9_ending_2_end", "type": "end", "ending": "ending_dadao_merge", "title": "结局二·大道归一", "summary": "你选择与道合一，放弃个体意识，成为天道的一部分。虽能永恒存在，却也失去了作为\"云泽\"的一切。这是一个悲壮的结局，也是一种另类的超脱。"},
    {"id": "ch9_ending_3", "type": "narrate", "text": "云泽使出了\"遁去的一\"的终极奥义。\n\n那是打破天道枷锁的力量，是超脱轮回的关键。\n\n\"天道轮回，始于不公，终于平等。\"\n\n\"我以'遁去的一'之名，宣布——轮回终结！\"\n\n天玄子的力量被彻底瓦解。新的纪元开启了。\n\n而云泽，也回到了青云镇——那是一切开始的地方。", "scene": "青云镇", "next": "ch9_ending_3_end"},
    {"id": "ch9_ending_3_end", "type": "narrate", "text": "新纪元的青云镇，一切如旧。\n\n老槐树下，一群孩子在嬉戏玩耍。云泽站在树下，看着那些熟悉又陌生的面孔。\n\n\"云泽！\"一个声音从身后传来。\n\n他转过头——苏晴雨、林惊羽、厉无心……他们都在。\n\n\"发什么发呆呢？\"苏晴雨笑着走来，\"走啦，去吃饭了。\"\n\n云泽望着他们，眼眶微热。\n\n新纪元里，他们不记得前世的一切，但命运让他们再次相遇。\n\n\"好。\"他轻声应道。\n\n——全文完——", "next": "ch9_final_end"},
    {"id": "ch9_final_end", "type": "end", "ending": "ending_transcend", "title": "终章·超脱轮回", "summary": "你以'遁去的一'打破了天道轮回，开创新的纪元。虽然失去了天道主宰的力量，却保留了作为'云泽'的一切。在新纪元里，所有羁绊角色重生，虽不记得前世，却再次相遇。这是最好的结局——以凡人之躯，书写自己的命运。"}
]

# Update meta
story['meta']['total_chapters'] = 9
story['meta']['description'] = "寻道·文字冒险游戏第1-9章剧情数据，包含青云少年篇、仙缘初显篇、踏上道途篇、仙门磨砺篇、内门试炼篇、九宗大比篇、饕餮觉醒篇、前世觉醒篇、终章篇"

# Add chapters
story['story']['ch4'] = {
    "title": "第四章·仙门磨砺",
    "summary": "三年苦修，云泽修为精进，昆仑秘境名额之争尘埃落定。林惊羽再次出现，对游子剑的来历产生了浓厚兴趣。赵乾坤记恨云泽，暗中使绊子。云泽在选拔中击败赵乾坤，正式获得昆仑秘境入场资格。",
    "core_events": ["三年修炼进度飞快", "林惊羽试探游子剑", "赵乾坤冲突", "昆仑秘境名额选拔"],
    "choice_count": 2,
    "node_count": len(ch4_nodes),
    "nodes": ch4_nodes
}
story['story']['ch5'] = {
    "title": "第五章·内门试炼",
    "summary": "昆仑秘境试炼开启。云泽在秘境深处发现了云游子留下的记忆碎片——三百年前的惊天真相浮出水面：天璇真人，正是当年追杀云游子的凶手！原来收他为徒，不过是为了找到云游子的传承……云泽面临人生中最艰难的抉择。",
    "core_events": ["昆仑秘境组队", "云游子记忆揭露（关键转折）", "天璇真人=仇人真相", "核心抉择"],
    "choice_count": 2,
    "node_count": len(ch5_nodes),
    "nodes": ch5_nodes
}
story['story']['ch6'] = {
    "title": "第六章·九宗大比",
    "summary": "三年后，九宗论剑。云泽与林惊羽的惊天一战传遍修真界。天魔教少主厉无心突然现身，揭露了天道宗三百年前的惊天黑幕——天玄子背叛饕餮，才换来了天道宗的崛起。正与邪的界限，变得模糊起来……",
    "core_events": ["九宗大比决赛vs林惊羽", "厉无心黑幕揭露", "天道宗背叛饕餮真相", "正邪之辩"],
    "choice_count": 2,
    "node_count": len(ch6_nodes),
    "nodes": ch6_nodes
}
story['story']['ch7'] = {
    "title": "第七章·饕餮觉醒",
    "summary": "昆仑虚深处，饕餮的封印再次松动。正魔两道的临时联军组成，共同对抗饕餮。饕餮觉醒后，认出了云泽是道君转世！天璇真人在关键时刻自我封印，将全部传承与证道遗迹的线索托付给云泽后，消散于天地之间……",
    "core_events": ["正魔联军组成", "饕餮认出主角（前世身份线索）", "天璇真人自封牺牲", "证道遗迹线索获得"],
    "choice_count": 2,
    "node_count": len(ch7_nodes),
    "nodes": ch7_nodes
}
story['story']['ch8'] = {
    "title": "第八章·前世觉醒",
    "summary": "云泽进入证道遗迹，接受了道君传承。前世记忆觉醒——他就是第八纪元陨落的道君转世，\"遁去的一\"，九纪元以来唯一的变数。修为突破至炼虚境，他终于有了与天玄子正面对抗的资本。与天玄子的最终对决，即将到来……",
    "core_events": ["进入证道遗迹", "道君传承", "确认\"遁去的一\"身份", "修为突破炼虚境"],
    "choice_count": 1,
    "node_count": len(ch8_nodes),
    "nodes": ch8_nodes
}
story['story']['ch9'] = {
    "title": "终章·超脱轮回",
    "summary": "最终决战！云泽与天玄子的激战进入白热化。天玄子被击败后，天道本源的大门向云泽敞开。他面前出现了三条路——成为天道主宰、与道合一、或是超脱轮回。你的选择，将决定最终的结局……",
    "core_events": ["最终决战vs天玄子", "饕餮最终对话", "天道本源选择", "5个结局入口"],
    "choice_count": 1,
    "node_count": len(ch9_nodes),
    "nodes": ch9_nodes
}

# Write story.json
with open('data/story.json', 'w', encoding='utf-8') as f:
    json.dump(story, f, ensure_ascii=False, indent=2)

# Build and write endings.json
endings_data = {
    "meta": {
        "title": "寻道·文字冒险 - 结局列表",
        "version": "1.0.0",
        "total_endings": 5,
        "description": "5个结局的触发条件说明"
    },
    "endings": [
        {
            "id": "ending_tiandao_dominate",
            "title": "天道独尊",
            "type": "dominant",
            "description": "你成为新的天道主宰，以绝对的力量守护三界。",
            "trigger_conditions": ["ch9_choice_final选择了\"取代天道\"", "修为 >= 200", "心性 >= 80"],
            "requirements": {"修为": {"gte": 200}, "心性": {"gte": 80}},
            "effects": {"gains": ["成为天道主宰", "三界安宁"], "sacrifices": ["失去所有羁绊", "成为永恒孤独者"]},
            "unlock_hints": "需要足够高的修为和心性，且在终章选择第一项。"
        },
        {
            "id": "ending_dadao_merge",
            "title": "大道归一",
            "type": "transcendent",
            "description": "你选择与道合一，放弃个体意识，成为天道的一部分。",
            "trigger_conditions": ["ch9_choice_final选择了\"与道合一\"", "心性 < 80"],
            "requirements": {"心性": {"lt": 80}},
            "effects": {"gains": ["永恒存在", "天道守护者"], "sacrifices": ["失去个体意识", "不再记得任何人"]},
            "unlock_hints": "心性不足80时，选择第二项会进入此结局。"
        },
        {
            "id": "ending_transcend",
            "title": "超脱轮回（完美结局）",
            "type": "perfect",
            "description": "你以'遁去的一'打破了天道轮回，开创新的纪元，所有羁绊角色重生相聚。",
            "trigger_conditions": ["ch9_choice_final选择了\"超脱轮回\"", "修为 >= 150", "缘 >= 50", "心性 >= 90", "accept_daojun = True"],
            "requirements": {"修为": {"gte": 150}, "缘": {"gte": 50}, "心性": {"gte": 90}},
            "effects": {"gains": ["打破轮回", "羁绊角色全部存活", "新纪元开启"], "sacrifices": ["失去天道主宰力量"]},
            "unlock_hints": "完美结局！需要心性>=90、修为>=150、缘>=50，且接受了道君传承。"
        },
        {
            "id": "ending_taotie_ally",
            "title": "道君归来",
            "type": "good",
            "description": "你与饕餮并肩作战，共同击败天玄子，但天道本源落入你手。",
            "trigger_conditions": ["修为 >= 200 AND 心性 >= 80", "ch8_choice_identity接受了道君传承", "trust_linjingyu = True"],
            "requirements": {"修为": {"gte": 200}, "心性": {"gte": 80}},
            "effects": {"gains": ["击败天玄子", "饕餮认可"], "sacrifices": ["需要做出艰难选择"]},
            "unlock_hints": "需要高修为(>=200)和高心性(>=80)，且信任了林惊羽。"
        },
        {
            "id": "ending_lone_hero",
            "title": "孤独行道",
            "type": "neutral",
            "description": "你独自击败天玄子，但代价惨重，羁绊角色各有归宿。",
            "trigger_conditions": ["修为 < 200 OR 心性 < 80", "ch9_choice_final选择了第三项", "decline_daojun = True"],
            "requirements": {"修为": {"lt": 200}},
            "effects": {"gains": ["击败天玄子", "天道恢复平衡"], "sacrifices": ["部分羁绊角色牺牲或遗忘"]},
            "unlock_hints": "修为或心性不足时，可能进入此结局。需要重新积累。"
        }
    ],
    "trigger_logic": {
        "ch9_final_choice": {
            "ending_tiandao_dominate": "选择了\"取代天道\"，且修为>=200且心性>=80",
            "ending_dadao_merge": "选择了\"与道合一\"",
            "ending_transcend": "选择了\"超脱轮回\"，且修为>=150且缘>=50且心性>=90"
        },
        "key_flags": {
            "forgive_tianxuan": "第5章选择原谅天璇真人的关键标志，影响饕餮对话和部分结局",
            "seek_revenge": "第5章选择复仇的关键标志，影响与厉无心的关系",
            "trust_linjingyu": "第5章选择信任林惊羽的关键标志，影响道心裂隙事件走向",
            "accept_daojun": "第8章接受道君传承的关键标志，影响最终结局类型",
            "decline_daojun": "第8章拒绝道君传承的关键标志",
            "seek_truth": "第7章选择追寻真相的关键标志",
            "win_battle": "第6章险胜林惊羽的关键标志",
            "trust_liwuxin": "第6章选择相信厉无心的关键标志"
        }
    }
}

with open('data/endings.json', 'w', encoding='utf-8') as f:
    json.dump(endings_data, f, ensure_ascii=False, indent=2)

# Stats
total_nodes = len(ch4_nodes) + len(ch5_nodes) + len(ch6_nodes) + len(ch7_nodes) + len(ch8_nodes) + len(ch9_nodes)
total_choices = 2 + 2 + 2 + 2 + 1 + 1

print(f"Chapters 4-9 added successfully!")
print(f"Total new nodes: {total_nodes}")
print(f"Total new choices: {total_choices}")
print(f"\nPer-chapter breakdown:")
print(f"  ch4: {len(ch4_nodes)} nodes, 2 choices")
print(f"  ch5: {len(ch5_nodes)} nodes, 2 choices")
print(f"  ch6: {len(ch6_nodes)} nodes, 2 choices")
print(f"  ch7: {len(ch7_nodes)} nodes, 2 choices")
print(f"  ch8: {len(ch8_nodes)} nodes, 1 choice")
print(f"  ch9: {len(ch9_nodes)} nodes, 1 choice")
print(f"\n5 endings defined in endings.json")
