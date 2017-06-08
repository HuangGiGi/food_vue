<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index)">
                        <span class="text">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul>
                    <li v-for="item in goods" class="food-list" ref="foodList">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
                                <div class="icon">
                                    <img width="57" height="57" :src="food.icon" alt="" />
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}份</span>
                                        <span>好评率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol @add="addFood" :food="food"></cartcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <shopcart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>  
        </div>
        <food @add="addFood" :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from '@/components/shopcart/shopcart'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import food from '@/components/food/food'

const ERR_OK = 0
export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {}
        }
    },
    computed: {
        currentIndex() {
            for (var i = 0; i < this.listHeight.length; i++) {
                var height1 = this.listHeight[i]
                var height2 = this.listHeight[i + 1]
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i
                }
            }
            return 0
        },
        selectFoods() {
            var foods = []
            this.goods.forEach(function(good) {
                good.foods.forEach(function(food) {
                    if (food.count) {
                        foods.push(food)
                    }
                })
            })
            return foods
        }
    },
    created() {
        this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
        this.$http.get('/api/goods').then(function(response) {
            response = response.body
            if (response.errno === ERR_OK) {
                this.goods = response.data
                this.$nextTick(function() {
                    this._initScroll()
                    this._calculateHeight()
                })
            }
        })
    },
    methods: {
        selectMenu(index) {
            var foodList = this.$refs.foodList
            var el = foodList[index]
            this.foodsScroll.scrollToElement(el, 300)
        },
        selectFood(food, event) {
            if (!event._constructed) {
                return
            }
            this.selectedFood = food
            this.$refs.food.show()
        },
        addFood(target) {
            this._drop(target)
        },
        _drop(target) {
            // 体验优化,异步执行下落动画
            this.$nextTick(function() {
                this.$refs.shopcart.drop(target)
            })
        },
        _initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true
            })
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                click: true,
                probeType: 3
            })
            this.foodsScroll.on('scroll', function(pos) {
                this.scrollY = Math.abs(Math.round(pos.y))
            })
        },
        _calculateHeight() {
            var foodList = this.$refs.foodList
            var height = 0
            this.listHeight.push(height)
            for (var i = 0; i < foodList.length; i++) {
                var item = foodList[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        }
    },
    components: {
        shopcart,
        cartcontrol,
        food
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../common/less/mixin.less";
    .goods{
        display: flex;
        position: absolute;
        top:174px;
        bottom:46px;
        width:100%;
        overflow: hidden;
        .menu-wrapper{
            flex:0 0 80px;
            width:80px;
            background-color: #f3f5f7;
            .menu-item{
                display:table;
                height:54px;
                width:56px;
                line-height: 14px;
                padding:0 12px;
                &.current{
                    position: relative;
                    z-index: 10;
                    margin-top: -1px;
                    background-color: #fff;
                    font-weight: 700;
                    .text{
                        &:after{
                            border:0;
                        }
                    }
                }
                .icon{
                    display: inline-block;
                    vertical-align: top;
                    width:12px;
                    height:12px;
                    margin-right: 4px;
                    background-size: 12px 12px;
                    background-repeat: no-repeat;
                    &.decrease{
                        background-image: url(decrease_3@2x.png);
                        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
                            background-image: url(decrease_3@3x.png);
                        }
                    }
                    &.discount{
                        background-image: url(discount_3@2x.png);
                        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
                            background-image: url(discount_3@3x.png);
                        }
                    }
                    &.guarantee{
                        background-image: url(guarantee_3@2x.png);
                        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
                            background-image: url(guarantee_3@3x.png);
                        }
                    }
                    &.invoice{
                        background-image: url(invoice_3@2x.png);
                        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
                            background-image: url(invoice_3@3x.png);
                        }
                    }
                    &.special{
                        background-image: url(special_3@2x.png);
                        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
                            background-image: url(special_3@3x.png);
                        }
                    }
                }
                .text{
                    display:table-cell;
                    width:56px;
                    vertical-align: middle;
                    font-size: 12px;
                    .border-1px(rgba(7, 17, 27, 0.1));
                }
            }
        }
        .foods-wrapper{
            flex:1;
            .title{
                padding-left: 14px;
                height:26px;
                line-height: 26px;
                border-left: 2px solid #d9dde1;
                font-size: 12px;
                color:rgb(147,153,159);
                background-color: #f3f5f7;
            }
            .food-item{
                display: flex;
                margin:18px;
                padding-bottom: 18px;
                .border-1px(rgba(7, 17, 27, 0.1));
                &:last-child{
                    &:after{
                        border:0;
                    }
                    margin-bottom: 0;
                }
                .icon{
                    flex:0 0 57px;
                    margin-right: 10px;
                }
                .content{
                    flex:1;
                    .name{
                        margin: 2px 0 8px 0;
                        height: 14px;
                        line-height: 14px;
                        font-size: 1px;
                        color: rgb(7, 17, 27);
                    }
                    .desc,.extra{
                        line-height: 10px;
                        font-size: 10px;
                        color:rgb(147,153,159);
                    }
                    .desc{
                        margin-bottom: 8px;
                        line-height: 12px;
                    }
                    .count{
                        margin-right: 12px;
                    }
                    .price{
                        line-height: 24px;
                        .now{
                            margin-right: 8px;
                            font-size: 14px;
                            font-weight: 700;
                            color: rgb(240, 20, 20);
                        }
                        .old{
                            text-decoration: line-through;
                            font-size: 10px;
                            font-weight: 700;
                            color:rgb(147,153,159);
                        }
                    }
                    .cartcontrol-wrapper{
                        position: absolute;
                        right: 0;
                        bottom: 12px;
                    }
                }
            }
        }
    }
</style>
