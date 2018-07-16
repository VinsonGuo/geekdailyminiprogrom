
//存储所需要的数据
const MAC_LENGTH = 17;    //地址字符串长度
const AK_MK_LENGTH = 6;   //地址的整形值
const TAG_LOG = "BleKey"; //调试信息标签
var EnableDebug = true;

var mcu_mac = [0x00, 0x00, 0x00, 0x00, 0x00, 
               0x00, 0x00, 0x00, 0x00, 0x00,
               0x00, 0x00, 0x00, 0x00, 0x00,
               0x00, 0x00, 0x00];
var app_mac = [0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00];

var ak = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
var mk = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

var mackey = 0x00;

//初始化
function BleKey_init(mcu_addr,app_addr,enDebug)
{
  if ((typeof (enDebug) != "boolean")||
    (typeof (mcu_addr) != "string")||
    (typeof (app_addr) != "string")) {
    console.error("mcu_addr(string)|app_addr(string)|enDebug(boolean) error type")
    return false;
  }
  if (mcu_addr.length != MAC_LENGTH || app_addr.length != MAC_LENGTH){
    console.error("mcu_addr|app_addr is got error length:" + MAC_LENGTH);
    return false;
  }
  EnableDebug = enDebug;
  for (var i = 0; i < MAC_LENGTH;i++){
    app_mac[i] = app_addr[i];
    mcu_mac[i] = mcu_addr[i];
  }
  return BleKey_returnKey();
}
/**
 * calc Mackey
 */
function BleKey_returnKey()
{
  var i = 0;
  if(EnableDebug){
    var str = "app_mac:";
    for (i = 0; i < app_mac.length;i++){  
      str += app_mac[i].toString(16);
    }
    console.debug(TAG_LOG, str.slice(0, str.length-1));
    str = "mcu_mac:";
    for (i = 0; i < mcu_mac.length; i++) {
      str += mcu_mac[i].toString(16);
    }
    console.debug(TAG_LOG, str.slice(0, str.length - 1));
  }
  for (var i = 0; i < AK_MK_LENGTH;i++){
    ak[i] = parseInt(app_mac[i * 3].toString(16) + app_mac[i * 3 + 1].toString(16),16);
    mk[i] = parseInt(mcu_mac[i * 3].toString(16) + mcu_mac[i * 3 + 1].toString(16), 16);
    if(EnableDebug)
    {
      console.debug("ak[i]" + ak[i].toString(16));
      console.debug("mk[i]" + mk[i].toString(16));
    }
  }

  ak[0] += mk[0];
  ak[1] -= mk[1];
  ak[2] &= mk[2];
  ak[3] *= mk[3];
  ak[4] /= mk[4];
  ak[5] |= mk[5];

  ak[0] += ak[1];
  ak[0] += ak[2];
  ak[0] += ak[3];
  ak[0] += ak[4];
  ak[0] += ak[5];

  mackey = ak[0] & 0xff;
  if(EnableDebug){
    console.debug(TAG_LOG,"mac_key = " + mackey.toString(16));
  }
  return true;
}

//read
function BleKeyRead(data)
{
  if ((data instanceof Array)==false || data.length < 2){
    if(EnableDebug){
      console.error(TAG_LOG,"BleKeyRead param data[xx] error");
    }
    return undefined;
  }
  var out = new Array(data.length - 1);
  var tempK = data[0] + mackey;
  for(var i = data.length - 1;i>0;i--){
    out[i-1] = (data[i] - tempK * (i+2)) & 0xff;
  }
  return out;
}

//write 
function BleKeyWrite(data)
{
  if ((data instanceof Array) == false || data.length < 1) {
    if (EnableDebug) {
      console.error(TAG_LOG, "BleKeyWrite param data[xx] error");
    }
    return undefined;
  }
  var out = new Array(data.length + 1);
  out[0] = Math.floor(Math.random()*256) & 0xff;
  for (var i = 0; i < data.length; i++) {
    out[i + 1] = (data[i] + (out[0] + mackey) * (i + 3))&0xff;
  }
  return out;
}

module.exports = {
  init: BleKey_init,
  read: BleKeyRead,
  write: BleKeyWrite
}