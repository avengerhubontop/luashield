import { Script } from '../types';

/**
 * Generates an extreme volume of polymorphic disguised junk code.
 * Optimized to avoid "too many local variables" error by wrapping in 'do ... end' blocks.
 */
const generateExtremeJunk = (count: number): string => {
    const hex = () => Math.random().toString(16).slice(2, 8);
    const num = () => Math.floor(Math.random() * 0xFFFFFF);
    const patterns = [
        () => `do local _0x${hex()} = ${num()} + ${num()} if _0x${hex()} == ${num()} then return end end;`,
        () => `if (math.floor(math.pi * ${Math.random()}) > ${num()}) then (function() local _ = "${hex()}"; if _ == "${hex()}" then os.exit() end end)() end;`,
        () => `do local _0x${hex()} = string.char(${Math.floor(Math.random() * 255)}) if #_0x${hex()} > 1 then table.concat({}) end end;`,
        () => `(function() local t = {${num()}, ${num()}} if rawget(t, 1) == nil then error() end end)();`,
        () => `if false then local _ = string.unpack(">I4", "${hex()}") end;`,
        () => `do local _0x${hex()} = setmetatable({}, {__index = function() return ${num()} end}) if _0x${hex()}[1] == nil then end end;`,
        () => `(function(...) local a = {...} if #a < 0 then _G["${hex()}"] = 1 end return #a end)(${num()}, ${num()});`
    ];

    let junk = "";
    for (let i = 0; i < count; i++) {
        junk += patterns[Math.floor(Math.random() * patterns.length)]();
    }
    return junk;
};

/**
 * Advanced payload encryption: Circular Bit Rotation + XOR + Byte Shifting
 */
const extremeEncrypt = (source: string, key: number): string => {
    const input = unescape(encodeURIComponent(source));
    let output = "";
    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i) ^ ((key + i) % 256);
        charCode = ((charCode << 3) | (charCode >> 5)) & 255;
        output += charCode.toString(16).padStart(2, '0');
    }
    return output;
};

export const obfuscateScript = (source: string, script: Script, level: number = 30): string => {
    const secretKey = Math.floor(Math.random() * 255) + 1;
    const encryptedHex = extremeEncrypt(source, secretKey);
    // User requested "massive" and "unreadable" - inject 2200 lines of junk
    const junkBlock = generateExtremeJunk(2200);

    const vm = `local _S1,_S2,_S3,_S4,_S5,_S6,_S7,_S8,_S9 = string.char,unpack or table.unpack,loadstring or load,string.unpack,string.pack,string.sub,tonumber,error,debug;` +
               `local function _Check() if _S9 and (_S9.gethook() or _S9.getinfo(2)) then _S8(_S1(68,101,98,117,103,103,101,114,32,70,111,117,110,100)) end ` +
               `if _G.Decompile or _G.getgenv or _G.getfenv ~= getfenv then _S8(_S1(85,110,97,117,116,104,111,114,105,122,101,100,32,69,110,118)) end end;` +
               `_Check();` +
               `local function _Dec(d,k) ${generateExtremeJunk(5)} local o = ""; for i=1,#d,2 do local v = _S7(_S6(d,i,i+1),16); if not v then break end; v = ((v >> 3) | (v << 5)) & 255; o = o .. _S1(v ~ ((k+((i-1)/2))%256)); end return o; end;` +
               `${junkBlock}` +
               `local _Vm = _S3(_Dec("${encryptedHex}", ${secretKey}));` +
               `if not _Vm or type(_Vm) ~= "function" then _S8(_S1(86,77,32,73,110,116,101,103,114,105,116,121,32,69,114,114,111,114)) end;` +
               `return _Vm(_S2({...}));`;

    return `return(function(...) ${vm} end)(...)`;
};