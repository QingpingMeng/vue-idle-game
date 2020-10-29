import Vue from 'vue'
import Vuex from 'vuex'
import vueInstance from './main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sysInfo: [{
      type: '',
      msg: "欢迎你，菜鸟勇士。"
    }],
    playerAttribute: {
      GOLD: 0,
      healthRecoverySpeed:1,
      attribute : {
        CURHP: {
          value: 0,
          showValue: '',
        },
        MAXHP: {
          value: 0,
          showValue: '',
        },
        ATK: {
          value: 0,
          showValue: '',
        },
        DEF: {
          value: 0,
          showValue: '',
        },
        REDUCDMG:{  //根据护甲计算的减伤比例
          value: 0,
          showValue: '',
        },
        CRIT: {
          value: 0,
          showValue: '',
        },
        CRITDMG: {
          value: 0,
          showValue: '',
        },
      },
      weapon: {
        "lv": 1,
        itemType: 'weapon',
        "quality": {
          name: '破旧',
          qualityCoefficient: 0.7,
          probability: '0.25',
          color: '#a1a1a1',
          extraEntryNum: 1,
        },
        "type": {
          "name": "新手短剑",
          "des": "新手菜鸡使用的短剑",
          "iconSrc": "./icons/W_Sword001.png",
          "entry": [{
            "valCoefficient": 0.9,
            "value": 1,
            "showVal": "+1",
            "type": "ATK",
            "name": "攻击力"
          }]
        },
        "extraEntry": [{
          "value": 1,
          "showVal": "+1",
          "type": "ATK",
          "name": "攻击力"
        }]
      },
      armor: {
        "lv": 1,
        itemType: 'armor',
        "quality": {
          name: '破旧',
          qualityCoefficient: 0.7,
          probability: '0.25',
          color: '#a1a1a1',
          extraEntryNum: 1,
        },
        "type": {
          "name": "新手布衣",
          "des": "新手菜鸡穿的普通衣物",
          "iconSrc": "./icons/A_A3.png",
          "entry": [{
            "valCoefficient": 0.9,
            "value": 1,
            "showVal": "+1",
            "type": "DEF",
            "name": "防御力"
          }]
        },
        "extraEntry": [{
          "type": "HP",
          "value": 10,
          "showVal": "+10",
          "name": "生命值"
        }, ]
      },
      acc: {
        "lv": 1,
        itemType: 'acc',
        "quality": {
          name: '破旧',
          qualityCoefficient: 0.7,
          probability: '0.25',
          color: '#a1a1a1',
          extraEntryNum: 1,
        },
        "type": {
          "name": "新手指环",
          "des": "一个普通的指环",
          "iconSrc": "./icons/Ac_10.png",
          "entry": [{
            "valCoefficient": 0.9,
            "value": 20,
            "showVal": "+20",
            "type": "HP",
            "name": "生命值"
          }]
        },
        "extraEntry": [{
          "type": "CRIT",
          "value": 10,
          "showVal": "+10%",
          "name": "暴击几率"
        }]
      },
    }
  },
  getters: {
    calculatePlayerAttribute: state => {
      var p = state.playerAttribute
      var warpon = p.weapon,
        armor = p.armor,
        acc = p.acc,
        entry = []
      var attribute = {
        CURHP: {
          value: 0,
          showValue: '',
        },
        MAXHP: {
          value: 0,
          showValue: '',
        },
        ATK: {
          value: 0,
          showValue: '',
        },
        DEF: {
          value: 0,
          showValue: '',
        },
        CRIT: {
          value: 0,
          showValue: '',
        },
        CRITDMG: {
          value: 0,
          showValue: '',
        },
      }
      entry = [].concat(warpon.type.entry).concat(warpon.extraEntry).concat(armor.type.entry).concat(armor.extraEntry).concat(acc.type.entry).concat(acc.extraEntry)
      entry.map(item => {
        switch (item.type) {
          case 'ATK':
            attribute.ATK.value += Number(item.value)
            attribute.ATK.showValue = '+' + (attribute.ATK.value)
            break;
          case 'DEF':
            attribute.DEF.value += Number(item.value)
            attribute.DEF.showValue = '+' + (attribute.DEF.value)
            break;
          case 'HP':
            attribute.MAXHP.value += Number(item.value)
            attribute.MAXHP.showValue = '+' + (attribute.MAXHP.value)
            break;
          case 'CRIT':
            attribute.CRIT.value += Number(item.value)
            attribute.CRIT.showValue = '+' + attribute.CRIT.value + '%'
            break;
          case 'CRITDMG':
            attribute.CRITDMG.value += Number(item.value)
            attribute.CRITDMG.showValue = '+' + attribute.CRITDMG.value + '%'
            break;
          default:
            break;
        }
      })
      // console.log(vueInstance.$store.state)
      attribute.MAXHP.value += 100
      if(!attribute.CURHP.value){
        attribute.CURHP = JSON.parse(JSON.stringify(attribute.MAXHP))
      }
      
      // 初始暴击伤害150%
      attribute.CRITDMG.value += 150
      
      var atk = attribute.ATK.value,crit = attribute.CRIT.value,critdmg = attribute.CRITDMG.value
      // 暴击率最多100%
      if(crit >100){
        crit = 100
      }
      attribute.DPS = parseFloat((1-crit/100)*atk*1 + crit/100*(critdmg)/100*atk*1)
      var armor = attribute.DEF.value

      //承受伤害比例
      attribute.REDUCDMG = 1 - 0.06 * armor / (1 + (0.06 * armor))
      // state.playerAttribute.attribute=attribute
      vueInstance.$store.commit("set_player_attribute", attribute);
      return attribute
    }

  },
  mutations: {
    set_player_attribute(state, data){
      this.state.playerAttribute.attribute = data
    },
    set_sys_info(state, data) {
      this.state.sysInfo.push(data);
      var time = +new Date()
      var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
      this.state.sysInfo[this.state.sysInfo.length - 1].time = date.toJSON().substr(11, 8).replace('T', ' ')
    },
    set_player_gold(state, data) {
      this.state.playerAttribute.GOLD+=Number(data);
    },
    set_player_curhp(state, data) {
      var CURHP =this.state.playerAttribute.attribute.CURHP,MAXHP=this.state.playerAttribute.attribute.MAXHP
      CURHP.value+=Number(data);
      CURHP.value = parseInt(CURHP.value)
      if(CURHP.value>MAXHP.value){
        CURHP.value=MAXHP.value
      }
    }
  },
})