import { Injectable } from '@angular/core'
import { Cipher } from 'src/app/types/Cipher'
import { Uint8PublicKeyShare } from 'src/app/types/KeyShareSync'
import axios from '../../../../node_modules/axios'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseURL: string = 'https://calm-wildwood-85369.herokuapp.com/https://6b3a-46-101-241-92.ngrok.io'

  constructor() {}

  async postKeygen(keyShare: Uint8PublicKeyShare, vote: string = 'Vote5', sealer: string = 'bob') {
    const body = JSON.stringify({
      pk: keyShare.pk,
      proof: keyShare.proof
    })
    return axios.post(`${this.baseURL}/keygen/${vote}/${sealer}`, body, {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  async getEncryptedCiphers(_vote: string = 'Vote5', _question: string = 'Question1'): Promise<Cipher[]> {
    return [
      {
        a: [
          41,
          212,
          1,
          41,
          18,
          154,
          113,
          27,
          167,
          144,
          2,
          247,
          188,
          55,
          76,
          53,
          47,
          65,
          209,
          19,
          190,
          117,
          163,
          95,
          215,
          49,
          225,
          16,
          27,
          234,
          96,
          164,
          207,
          160,
          246,
          54,
          175,
          181,
          59,
          181,
          51,
          49,
          26,
          219,
          82,
          148,
          156,
          161,
          196,
          161,
          168,
          49,
          242,
          219,
          120,
          16,
          64,
          210,
          113,
          255,
          165,
          87,
          62,
          40,
          105,
          232,
          29,
          152,
          171,
          38,
          220,
          90,
          20,
          70,
          252,
          211,
          88,
          2,
          230,
          222,
          39,
          45,
          196,
          56,
          107,
          224,
          40,
          50,
          17,
          250,
          201,
          36,
          239,
          162,
          180,
          133,
          26,
          28,
          167,
          127,
          88,
          225,
          240,
          104,
          119,
          71,
          236,
          200,
          237,
          217,
          21,
          194,
          175,
          196,
          32,
          37,
          216,
          203,
          34,
          133,
          172,
          176,
          129,
          113,
          81,
          64,
          62,
          48,
          21,
          80,
          242,
          16,
          55,
          154,
          126,
          162,
          119,
          242,
          241,
          37,
          11,
          52,
          146,
          247,
          236,
          57,
          107,
          157,
          243,
          243,
          63,
          221,
          154,
          219,
          13,
          51,
          134,
          200,
          92,
          216,
          250,
          24,
          216,
          246,
          163,
          157,
          123,
          174,
          163,
          181,
          2,
          224,
          81,
          214,
          99,
          101,
          141,
          230,
          95,
          139,
          233,
          119,
          103,
          134,
          4,
          66,
          154,
          153,
          53,
          15,
          40,
          239,
          239,
          227,
          43,
          61,
          171,
          52,
          103,
          225,
          254,
          72,
          72,
          89,
          203,
          106,
          123,
          210,
          184,
          186,
          232,
          4,
          72,
          153,
          51,
          101,
          240,
          57,
          17,
          62,
          42,
          128,
          141,
          99,
          116,
          117,
          121,
          228,
          76,
          241,
          167,
          241,
          53,
          80,
          19,
          237,
          205,
          81,
          30,
          242,
          216,
          183,
          71,
          250,
          155,
          3,
          208,
          99,
          115,
          131,
          126,
          141,
          139,
          154,
          51,
          185
        ],
        b: [
          75,
          201,
          81,
          36,
          114,
          173,
          56,
          221,
          192,
          120,
          183,
          190,
          102,
          152,
          238,
          233,
          243,
          222,
          0,
          84,
          230,
          222,
          116,
          220,
          158,
          40,
          130,
          182,
          51,
          1,
          143,
          246,
          23,
          140,
          244,
          253,
          136,
          187,
          255,
          37,
          201,
          77,
          236,
          171,
          4,
          40,
          213,
          113,
          165,
          220,
          107,
          87,
          165,
          136,
          76,
          141,
          241,
          197,
          148,
          194,
          191,
          67,
          154,
          0,
          205,
          212,
          151,
          13,
          223,
          192,
          177,
          155,
          153,
          51,
          165,
          119,
          190,
          216,
          246,
          134,
          82,
          225,
          93,
          214,
          12,
          181,
          238,
          103,
          138,
          50,
          140,
          87,
          131,
          93,
          139,
          90,
          211,
          32,
          43,
          217,
          129,
          75,
          2,
          62,
          66,
          160,
          88,
          149,
          222,
          100,
          207,
          78,
          144,
          13,
          161,
          45,
          109,
          100,
          160,
          161,
          124,
          247,
          16,
          254,
          238,
          108,
          112,
          79,
          126,
          87,
          238,
          23,
          196,
          15,
          81,
          112,
          82,
          13,
          181,
          216,
          13,
          56,
          1,
          191,
          101,
          118,
          191,
          245,
          182,
          10,
          103,
          227,
          100,
          214,
          11,
          159,
          255,
          125,
          183,
          185,
          80,
          72,
          16,
          64,
          75,
          186,
          178,
          152,
          139,
          120,
          209,
          100,
          105,
          127,
          195,
          88,
          170,
          163,
          218,
          156,
          157,
          245,
          68,
          217,
          247,
          210,
          187,
          116,
          183,
          47,
          216,
          174,
          150,
          157,
          72,
          52,
          255,
          248,
          152,
          135,
          55,
          32,
          47,
          113,
          51,
          232,
          38,
          42,
          38,
          234,
          12,
          190,
          209,
          249,
          180,
          157,
          32,
          6,
          113,
          225,
          22,
          101,
          135,
          81,
          241,
          62,
          136,
          91,
          37,
          78,
          32,
          82,
          215,
          177,
          200,
          54,
          115,
          196,
          132,
          73,
          6,
          244,
          16,
          27,
          64,
          5,
          114,
          75,
          225,
          95,
          1,
          235,
          51,
          46,
          94,
          160
        ]
      },
      {
        a: [
          105,
          67,
          62,
          106,
          33,
          0,
          94,
          64,
          97,
          134,
          188,
          112,
          200,
          102,
          10,
          72,
          165,
          103,
          197,
          183,
          95,
          204,
          217,
          14,
          152,
          31,
          228,
          152,
          60,
          16,
          34,
          94,
          64,
          11,
          52,
          128,
          178,
          108,
          156,
          220,
          126,
          170,
          22,
          227,
          93,
          169,
          52,
          119,
          16,
          245,
          251,
          217,
          24,
          123,
          70,
          155,
          47,
          42,
          38,
          16,
          183,
          8,
          220,
          249,
          164,
          34,
          195,
          9,
          95,
          90,
          64,
          51,
          110,
          233,
          138,
          32,
          91,
          231,
          215,
          255,
          11,
          203,
          76,
          25,
          229,
          171,
          217,
          6,
          130,
          53,
          154,
          217,
          22,
          186,
          234,
          234,
          97,
          120,
          223,
          52,
          250,
          126,
          64,
          20,
          201,
          184,
          110,
          193,
          21,
          152,
          71,
          33,
          110,
          76,
          142,
          105,
          209,
          2,
          48,
          164,
          32,
          177,
          254,
          211,
          83,
          209,
          68,
          243,
          176,
          206,
          192,
          187,
          53,
          31,
          197,
          164,
          50,
          233,
          96,
          91,
          110,
          147,
          28,
          107,
          49,
          88,
          87,
          96,
          80,
          173,
          122,
          95,
          125,
          143,
          52,
          64,
          136,
          34,
          55,
          154,
          250,
          185,
          135,
          212,
          254,
          238,
          27,
          106,
          202,
          248,
          170,
          115,
          94,
          73,
          197,
          2,
          229,
          123,
          79,
          214,
          173,
          21,
          115,
          143,
          190,
          99,
          86,
          178,
          44,
          7,
          184,
          8,
          103,
          227,
          255,
          86,
          66,
          103,
          246,
          97,
          213,
          246,
          213,
          18,
          135,
          68,
          150,
          199,
          69,
          94,
          74,
          246,
          95,
          235,
          71,
          160,
          211,
          176,
          129,
          45,
          237,
          53,
          183,
          101,
          68,
          58,
          108,
          143,
          69,
          21,
          133,
          142,
          26,
          42,
          239,
          202,
          227,
          133,
          165,
          115,
          11,
          23,
          137,
          126,
          243,
          182,
          167,
          51,
          93,
          200,
          192,
          34,
          7,
          193,
          95,
          248
        ],
        b: [
          50,
          111,
          176,
          242,
          136,
          123,
          97,
          249,
          65,
          195,
          112,
          19,
          55,
          6,
          223,
          47,
          129,
          67,
          84,
          32,
          167,
          91,
          164,
          223,
          25,
          184,
          91,
          190,
          57,
          206,
          208,
          144,
          98,
          166,
          129,
          171,
          113,
          80,
          181,
          65,
          208,
          75,
          213,
          83,
          23,
          67,
          105,
          156,
          122,
          49,
          62,
          14,
          254,
          17,
          238,
          169,
          7,
          64,
          185,
          200,
          15,
          193,
          72,
          105,
          192,
          66,
          212,
          160,
          193,
          172,
          239,
          101,
          216,
          98,
          219,
          159,
          237,
          182,
          98,
          140,
          101,
          232,
          119,
          151,
          202,
          8,
          66,
          23,
          36,
          144,
          60,
          180,
          2,
          33,
          188,
          167,
          4,
          95,
          119,
          223,
          126,
          87,
          118,
          253,
          114,
          190,
          143,
          84,
          183,
          59,
          228,
          132,
          182,
          221,
          56,
          19,
          63,
          37,
          248,
          130,
          208,
          188,
          27,
          45,
          157,
          204,
          117,
          2,
          181,
          93,
          28,
          72,
          105,
          91,
          15,
          243,
          32,
          20,
          73,
          228,
          254,
          38,
          74,
          34,
          237,
          61,
          179,
          102,
          147,
          25,
          161,
          120,
          210,
          120,
          21,
          94,
          185,
          134,
          113,
          81,
          242,
          213,
          163,
          16,
          158,
          238,
          96,
          69,
          81,
          2,
          243,
          0,
          44,
          193,
          22,
          246,
          150,
          34,
          51,
          89,
          100,
          242,
          25,
          98,
          58,
          32,
          142,
          244,
          225,
          63,
          41,
          85,
          140,
          218,
          6,
          89,
          197,
          214,
          242,
          35,
          212,
          98,
          73,
          154,
          82,
          193,
          107,
          120,
          212,
          229,
          13,
          86,
          93,
          153,
          102,
          203,
          246,
          174,
          13,
          232,
          191,
          127,
          30,
          179,
          102,
          180,
          108,
          84,
          184,
          168,
          12,
          224,
          84,
          47,
          210,
          228,
          192,
          214,
          20,
          122,
          173,
          45,
          204,
          236,
          255,
          14,
          1,
          137,
          7,
          245,
          37,
          106,
          165,
          206,
          193,
          20
        ]
      },
      {
        a: [
          3,
          193,
          108,
          144,
          111,
          116,
          24,
          83,
          44,
          181,
          101,
          231,
          62,
          183,
          173,
          91,
          140,
          159,
          167,
          237,
          168,
          157,
          208,
          190,
          145,
          87,
          146,
          244,
          54,
          6,
          6,
          6,
          219,
          119,
          172,
          244,
          148,
          57,
          51,
          178,
          133,
          212,
          64,
          238,
          110,
          196,
          110,
          1,
          89,
          247,
          113,
          25,
          149,
          149,
          133,
          134,
          224,
          39,
          238,
          227,
          173,
          32,
          131,
          127,
          244,
          237,
          124,
          244,
          210,
          151,
          119,
          107,
          171,
          144,
          206,
          174,
          127,
          171,
          148,
          114,
          26,
          219,
          111,
          36,
          60,
          119,
          250,
          96,
          10,
          160,
          53,
          86,
          17,
          253,
          241,
          80,
          175,
          96,
          132,
          122,
          22,
          97,
          245,
          96,
          8,
          198,
          236,
          207,
          191,
          56,
          204,
          194,
          93,
          154,
          12,
          196,
          107,
          180,
          177,
          64,
          129,
          48,
          215,
          207,
          218,
          115,
          189,
          13,
          47,
          169,
          222,
          207,
          245,
          14,
          218,
          222,
          168,
          35,
          37,
          205,
          12,
          235,
          196,
          142,
          33,
          133,
          79,
          153,
          151,
          126,
          77,
          107,
          242,
          105,
          80,
          108,
          249,
          229,
          4,
          163,
          7,
          38,
          37,
          97,
          216,
          3,
          168,
          246,
          180,
          117,
          59,
          244,
          160,
          216,
          105,
          231,
          110,
          58,
          132,
          130,
          12,
          32,
          140,
          91,
          230,
          64,
          20,
          13,
          131,
          214,
          62,
          129,
          190,
          136,
          190,
          171,
          116,
          132,
          184,
          223,
          11,
          116,
          235,
          254,
          33,
          96,
          211,
          189,
          73,
          92,
          155,
          75,
          222,
          149,
          72,
          20,
          58,
          177,
          145,
          57,
          124,
          92,
          189,
          225,
          206,
          44,
          91,
          100,
          92,
          181,
          50,
          252,
          31,
          76,
          34,
          210,
          36,
          213,
          76,
          250,
          230,
          112,
          219,
          125,
          5,
          72,
          19,
          252,
          58,
          60,
          119,
          144,
          244,
          219,
          85,
          214
        ],
        b: [
          68,
          94,
          210,
          125,
          34,
          55,
          177,
          123,
          78,
          186,
          102,
          128,
          175,
          205,
          99,
          248,
          235,
          81,
          126,
          28,
          238,
          189,
          101,
          53,
          201,
          215,
          177,
          168,
          6,
          59,
          18,
          95,
          34,
          221,
          117,
          100,
          63,
          109,
          147,
          221,
          188,
          233,
          44,
          73,
          0,
          123,
          71,
          234,
          223,
          254,
          158,
          114,
          72,
          77,
          42,
          79,
          45,
          62,
          183,
          207,
          255,
          90,
          36,
          189,
          232,
          121,
          58,
          45,
          39,
          66,
          167,
          55,
          149,
          236,
          215,
          235,
          230,
          114,
          137,
          18,
          31,
          38,
          5,
          160,
          68,
          254,
          224,
          243,
          185,
          78,
          197,
          158,
          6,
          158,
          246,
          80,
          59,
          46,
          133,
          0,
          75,
          14,
          179,
          165,
          42,
          55,
          150,
          146,
          9,
          158,
          14,
          124,
          209,
          77,
          205,
          159,
          252,
          163,
          207,
          76,
          66,
          80,
          158,
          214,
          108,
          94,
          219,
          82,
          225,
          171,
          204,
          32,
          231,
          42,
          204,
          8,
          115,
          3,
          245,
          113,
          109,
          26,
          64,
          167,
          132,
          60,
          153,
          9,
          22,
          86,
          101,
          132,
          239,
          253,
          126,
          252,
          136,
          80,
          39,
          225,
          255,
          114,
          232,
          252,
          71,
          155,
          7,
          94,
          80,
          0,
          122,
          100,
          21,
          131,
          128,
          148,
          176,
          157,
          125,
          243,
          115,
          234,
          35,
          121,
          26,
          192,
          10,
          102,
          144,
          120,
          202,
          2,
          95,
          146,
          57,
          107,
          208,
          154,
          201,
          194,
          103,
          129,
          180,
          253,
          143,
          221,
          19,
          102,
          114,
          169,
          175,
          110,
          187,
          211,
          197,
          222,
          29,
          23,
          71,
          205,
          8,
          236,
          97,
          72,
          195,
          250,
          228,
          141,
          110,
          75,
          221,
          182,
          22,
          130,
          36,
          80,
          155,
          134,
          166,
          166,
          202,
          44,
          206,
          162,
          190,
          166,
          89,
          167,
          206,
          71,
          190,
          57,
          244,
          233,
          66,
          172
        ]
      },
      {
        a: [
          49,
          118,
          74,
          129,
          67,
          8,
          92,
          149,
          129,
          17,
          39,
          18,
          251,
          209,
          217,
          115,
          71,
          123,
          201,
          194,
          203,
          44,
          194,
          42,
          233,
          139,
          106,
          203,
          54,
          26,
          55,
          222,
          107,
          36,
          194,
          232,
          86,
          61,
          114,
          25,
          248,
          244,
          72,
          0,
          1,
          180,
          155,
          174,
          103,
          213,
          205,
          8,
          174,
          33,
          176,
          163,
          74,
          85,
          68,
          165,
          170,
          57,
          104,
          43,
          141,
          166,
          125,
          157,
          161,
          59,
          1,
          182,
          201,
          76,
          237,
          83,
          34,
          68,
          248,
          0,
          34,
          25,
          24,
          78,
          95,
          172,
          17,
          243,
          142,
          110,
          204,
          191,
          88,
          23,
          238,
          92,
          239,
          91,
          178,
          148,
          78,
          166,
          205,
          71,
          32,
          56,
          188,
          55,
          238,
          113,
          76,
          74,
          134,
          41,
          17,
          50,
          179,
          26,
          22,
          79,
          89,
          149,
          165,
          171,
          240,
          139,
          45,
          33,
          3,
          99,
          204,
          206,
          74,
          51,
          125,
          177,
          6,
          53,
          82,
          164,
          181,
          188,
          69,
          224,
          71,
          214,
          105,
          65,
          254,
          181,
          128,
          55,
          204,
          93,
          185,
          148,
          247,
          229,
          210,
          159,
          78,
          91,
          109,
          54,
          83,
          223,
          245,
          249,
          196,
          66,
          22,
          204,
          96,
          165,
          166,
          207,
          111,
          26,
          124,
          254,
          250,
          196,
          250,
          218,
          44,
          0,
          213,
          72,
          202,
          92,
          68,
          235,
          196,
          77,
          170,
          240,
          58,
          201,
          191,
          112,
          189,
          98,
          133,
          239,
          114,
          120,
          211,
          120,
          219,
          111,
          16,
          174,
          147,
          24,
          136,
          251,
          230,
          225,
          91,
          35,
          5,
          134,
          0,
          160,
          232,
          186,
          28,
          15,
          65,
          64,
          248,
          97,
          25,
          144,
          114,
          192,
          114,
          9,
          239,
          217,
          47,
          30,
          175,
          78,
          168,
          111,
          193,
          27,
          145,
          82,
          1,
          26,
          247,
          247,
          127,
          33
        ],
        b: [
          132,
          87,
          214,
          55,
          132,
          106,
          231,
          187,
          146,
          85,
          147,
          101,
          125,
          223,
          29,
          80,
          26,
          16,
          89,
          104,
          163,
          90,
          197,
          214,
          69,
          224,
          170,
          119,
          234,
          78,
          126,
          182,
          75,
          181,
          227,
          165,
          138,
          208,
          82,
          35,
          2,
          102,
          140,
          236,
          118,
          136,
          214,
          36,
          224,
          248,
          196,
          65,
          126,
          207,
          155,
          138,
          153,
          244,
          92,
          44,
          255,
          202,
          249,
          177,
          4,
          133,
          109,
          101,
          164,
          161,
          22,
          118,
          124,
          11,
          147,
          200,
          81,
          167,
          87,
          95,
          242,
          186,
          253,
          29,
          190,
          79,
          217,
          130,
          125,
          222,
          110,
          169,
          176,
          206,
          101,
          60,
          106,
          232,
          166,
          57,
          52,
          8,
          170,
          80,
          40,
          13,
          226,
          214,
          66,
          99,
          124,
          164,
          228,
          164,
          10,
          30,
          68,
          16,
          142,
          146,
          197,
          116,
          116,
          36,
          237,
          93,
          162,
          208,
          130,
          89,
          159,
          135,
          221,
          233,
          174,
          193,
          94,
          151,
          189,
          137,
          168,
          173,
          219,
          143,
          220,
          140,
          84,
          99,
          216,
          180,
          20,
          172,
          45,
          20,
          242,
          215,
          238,
          164,
          249,
          138,
          111,
          73,
          249,
          249,
          17,
          243,
          196,
          228,
          67,
          185,
          201,
          61,
          229,
          247,
          162,
          59,
          172,
          59,
          135,
          36,
          128,
          220,
          50,
          55,
          6,
          62,
          153,
          107,
          104,
          29,
          144,
          83,
          226,
          131,
          25,
          90,
          54,
          182,
          243,
          35,
          172,
          218,
          125,
          220,
          40,
          54,
          140,
          86,
          182,
          211,
          50,
          15,
          197,
          70,
          2,
          60,
          193,
          46,
          105,
          194,
          131,
          3,
          141,
          17,
          131,
          102,
          206,
          47,
          157,
          169,
          144,
          128,
          92,
          70,
          98,
          197,
          243,
          117,
          206,
          136,
          45,
          48,
          17,
          135,
          43,
          126,
          206,
          17,
          12,
          7,
          194,
          39,
          161,
          172,
          228,
          116
        ]
      },
      {
        a: [
          4,
          6,
          179,
          254,
          86,
          48,
          11,
          89,
          231,
          168,
          78,
          242,
          98,
          146,
          58,
          113,
          164,
          55,
          76,
          46,
          102,
          156,
          50,
          208,
          56,
          15,
          233,
          216,
          200,
          73,
          163,
          38,
          51,
          5,
          97,
          181,
          77,
          92,
          240,
          73,
          197,
          149,
          164,
          100,
          83,
          250,
          26,
          65,
          7,
          175,
          43,
          47,
          187,
          44,
          157,
          43,
          47,
          67,
          108,
          182,
          221,
          191,
          181,
          240,
          225,
          193,
          116,
          228,
          28,
          187,
          101,
          240,
          228,
          47,
          48,
          178,
          56,
          66,
          111,
          43,
          213,
          74,
          170,
          5,
          43,
          147,
          161,
          36,
          32,
          14,
          164,
          236,
          240,
          93,
          252,
          138,
          172,
          236,
          64,
          211,
          15,
          94,
          160,
          6,
          181,
          237,
          226,
          130,
          251,
          236,
          178,
          215,
          231,
          45,
          60,
          161,
          68,
          94,
          86,
          84,
          218,
          152,
          35,
          60,
          53,
          150,
          127,
          227,
          83,
          56,
          89,
          210,
          217,
          217,
          21,
          215,
          111,
          143,
          211,
          71,
          95,
          238,
          197,
          151,
          4,
          127,
          218,
          75,
          52,
          249,
          238,
          239,
          110,
          80,
          52,
          247,
          223,
          52,
          172,
          240,
          29,
          131,
          219,
          118,
          254,
          94,
          210,
          1,
          188,
          40,
          68,
          145,
          97,
          146,
          112,
          195,
          201,
          206,
          85,
          219,
          81,
          115,
          217,
          132,
          65,
          68,
          35,
          7,
          141,
          186,
          190,
          164,
          216,
          245,
          1,
          209,
          201,
          69,
          133,
          105,
          126,
          123,
          243,
          77,
          190,
          102,
          180,
          231,
          18,
          205,
          64,
          130,
          239,
          70,
          224,
          153,
          221,
          102,
          169,
          148,
          78,
          194,
          116,
          100,
          214,
          248,
          244,
          85,
          107,
          189,
          136,
          10,
          197,
          62,
          193,
          236,
          122,
          80,
          215,
          178,
          133,
          22,
          138,
          9,
          176,
          87,
          131,
          98,
          137,
          198,
          89,
          185,
          66,
          71,
          19,
          15
        ],
        b: [
          73,
          15,
          117,
          129,
          159,
          31,
          231,
          202,
          34,
          211,
          103,
          197,
          230,
          43,
          186,
          76,
          246,
          33,
          123,
          249,
          37,
          177,
          156,
          122,
          146,
          57,
          52,
          189,
          126,
          150,
          73,
          253,
          205,
          78,
          29,
          208,
          255,
          242,
          231,
          247,
          65,
          69,
          151,
          151,
          16,
          162,
          186,
          233,
          109,
          83,
          217,
          183,
          196,
          149,
          35,
          0,
          73,
          124,
          8,
          116,
          235,
          204,
          0,
          140,
          243,
          93,
          134,
          65,
          207,
          230,
          17,
          255,
          68,
          168,
          24,
          7,
          142,
          48,
          30,
          82,
          141,
          135,
          109,
          143,
          116,
          174,
          0,
          62,
          206,
          161,
          54,
          220,
          32,
          115,
          157,
          78,
          28,
          41,
          216,
          246,
          19,
          188,
          133,
          189,
          63,
          137,
          116,
          111,
          8,
          140,
          144,
          242,
          56,
          83,
          210,
          219,
          16,
          3,
          22,
          239,
          126,
          118,
          127,
          229,
          131,
          12,
          152,
          29,
          235,
          74,
          69,
          185,
          129,
          104,
          187,
          133,
          88,
          103,
          194,
          46,
          203,
          225,
          106,
          188,
          251,
          91,
          172,
          151,
          185,
          103,
          160,
          159,
          180,
          199,
          140,
          71,
          151,
          42,
          186,
          205,
          147,
          96,
          151,
          77,
          217,
          248,
          44,
          31,
          177,
          213,
          217,
          79,
          60,
          93,
          31,
          252,
          176,
          7,
          247,
          61,
          4,
          9,
          152,
          184,
          183,
          143,
          193,
          251,
          209,
          14,
          171,
          233,
          87,
          36,
          116,
          93,
          10,
          174,
          234,
          165,
          57,
          163,
          136,
          255,
          254,
          253,
          212,
          149,
          94,
          58,
          136,
          90,
          168,
          52,
          222,
          34,
          64,
          100,
          126,
          198,
          19,
          201,
          20,
          94,
          188,
          136,
          127,
          115,
          157,
          49,
          212,
          10,
          224,
          227,
          143,
          9,
          154,
          244,
          90,
          63,
          131,
          124,
          15,
          26,
          159,
          225,
          41,
          178,
          75,
          89,
          106,
          254,
          167,
          114,
          84,
          19
        ]
      }
    ]
    // return axios.get(`${this.baseURL}/keygen/${vote}/${question}`, {
    //   headers: { 'Content-Type': 'application/json' }
    // })
  }
}
