
      // --- 音響システム (Web Audio API) ---
      class SoundEngine {
        constructor() {
          this.ctx = null;
          this.muted = false;
          this.bgmPlaying = false;
          this.bgmTimer = null;
          this.bgmStep = 0;
        }
        init() {
          if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        }
        toggleMute() {
          this.muted = !this.muted;
          if (this.muted) {
            this.stopBgm();
          }
          return !this.muted;
        }

        startBgm(isSpeedMode = false) {
          // 現在はBGM無し（SEのみ再生）
          // 自作のMP3などを使用する場合は、ここにオーディオ再生コードを追加できます
        }

        stopBgm() {
          // 現在はBGM無し
        }
        playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1) {
          if (this.muted) return;
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        }
        playKey() { this.playTone(600, 'sine', 0.04, 0.08); }
        playLaser() {
          if (this.muted) return;
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(now + 0.15);
        }
        playHit() {
          if (this.muted) return;
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(now + 0.2);
        }
        playCorrect(combo = 0) {
          if (this.muted) return;
          this.init();
          if (!this.ctx) return;
          const baseFreq = 523.25;
          const mult = Math.min(combo, 12);
          const freq1 = baseFreq * Math.pow(1.05946, mult);
          const freq2 = freq1 * 1.25;
          this.playTone(freq1, 'triangle', 0.12, 0.15);
          setTimeout(() => this.playTone(freq2, 'triangle', 0.18, 0.2), 80);
        }
        playWrong() {
          if (this.muted) return;
          this.init();
          if (!this.ctx) return;
          this.playTone(180, 'sawtooth', 0.18, 0.2);
          setTimeout(() => this.playTone(130, 'sawtooth', 0.25, 0.2), 120);
        }
        playLevelUp() {
          if (this.muted) return;
          const notes = [440, 554, 659, 880, 1108];
          notes.forEach((f, idx) => {
            setTimeout(() => this.playTone(f, 'sine', 0.28, 0.25), idx * 100);
          });
        }
        playFanfare() {
          if (this.muted) return;
          const notes = [523, 659, 783, 1046];
          notes.forEach((f, idx) => {
            setTimeout(() => this.playTone(f, 'sine', 0.25, 0.2), idx * 120);
          });
        }
      }

      const sound = new SoundEngine();

      // --- 称号・レベル定義 ---
      const TITLES = [
        { lv: 1, title: '九九ルーキー' },
        { lv: 2, title: 'アイアンスカウト' },
        { lv: 3, title: 'サイバーソルジャー' },
        { lv: 5, title: 'プラズマストライカー' },
        { lv: 8, title: 'バーストナイト' },
        { lv: 10, title: 'メガブレード戦士' },
        { lv: 15, title: 'シャドウアサシン' },
        { lv: 20, title: 'アストロコマンダー' },
        { lv: 25, title: 'クロノマスター' },
        { lv: 30, title: '銀河バスター' },
        { lv: 40, title: '神速の九九マスター' },
        { lv: 50, title: '超次元九九ゴッド' }
      { lv: 1, title: '九九ルーキー', desc: '九九のきほんを 学びはじめた 見習い戦士！' },
        { lv: 2, title: 'アイアンスカウト', desc: '敵メカを さくさく発見する てつの偵察兵！' },
        { lv: 3, title: 'サイバーソルジャー', desc: '計算エネルギーを まとった 本格バトル戦士！' },
        { lv: 5, title: 'プラズマストライカー', desc: '電撃のスピードで 九九のレーザーを放つ！' },
        { lv: 8, title: 'バーストナイト', desc: '連続正解コンボが とくいな 頼もしい騎士！' },
        { lv: 10, title: 'メガブレード戦士', desc: '巨大な光の剣で どんな敵メカも一刀両断！' },
        { lv: 15, title: 'シャドウアサシン', desc: '気配を消し、一瞬で九九の答えを射抜く！' },
        { lv: 20, title: 'アストロコマンダー', desc: '宇宙艦隊を ひきいる 百戦錬磨の司令官！' },
        { lv: 25, title: 'クロノマスター', desc: '時間をあやつり、タイムアタックを支配する！' },
        { lv: 30, title: '銀河バスター', desc: '銀河のへいわを まもる 伝説のスーパーヒーロー！' },
        { lv: 40, title: '神速の九九マスター', desc: '光よりも速い！ 誰も追いつけない九九の達人！' },
        { lv: 50, title: '超次元九九ゴッド', desc: '全宇宙のすべての九九を 統べる最高神！' }
      ];

      function getTitleForLevel(level) {
        let current = TITLES[0].title;
        for (const t of TITLES) {
          if (level >= t.lv) current = t.title;
        }
        return current;
      }

      function getExpForNextLevel(level) {
        // レベルごとの必要EXP調整（10問全問正解で約110EXP獲得）
        // Lv.1: 100 EXP（最初の10問クリアでちょうどLv.2に昇格！）
        // Lv.2: 約260 EXP（約25問正解＝2〜3回クリアでLv.3へ）
        // Lv.3: 約420 EXP（約40問正解＝4回クリアでLv.4へ）
        // Lv.5: 約760 EXP（約80問正解＝8回クリアでLv.6へ）
        return Math.round(100 + (level - 1) * 120 * Math.pow(level, 0.45));
      }

      // --- 敵ロボットのビジュアル生成（多彩なSVG） ---
      const ENEMY_SPECIES = [
        {
          type: 'スカウトドローン',
          tag: '偵察型',
          render: (color, accent) => `
          <svg width="85" height="85" viewBox="0 0 100 100">
            <!-- プロペラ -->
            <line x1="15" y1="20" x2="85" y2="20" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
            <line x1="50" y1="12" x2="50" y2="28" stroke="${accent}" stroke-width="3"/>
            <!-- 球体ボディ -->
            <circle cx="50" cy="55" r="30" fill="#102540" stroke="${color}" stroke-width="3.5"/>
            <!-- センサーアイ -->
            <ellipse cx="50" cy="55" rx="16" ry="12" fill="#040c17" stroke="#ff0055" stroke-width="2"/>
            <circle cx="50" cy="55" r="6" fill="#ff0055"/>
            <circle cx="54" cy="52" r="2" fill="#fff"/>
            <!-- ウイング -->
            <polygon points="12,50 22,40 22,65" fill="${color}"/>
            <polygon points="88,50 78,40 78,65" fill="${color}"/>
          </svg>
        `
        },
        {
          type: 'アイアンタイタン',
          tag: '重装型',
          render: (color, accent) => `
          <svg width="85" height="85" viewBox="0 0 100 100">
            <!-- ショルダーキャノン -->
            <rect x="18" y="15" width="10" height="25" fill="#1f3d64" stroke="${accent}" stroke-width="2"/>
            <rect x="72" y="15" width="10" height="25" fill="#1f3d64" stroke="${accent}" stroke-width="2"/>
            <!-- 重装甲ボディ -->
            <polygon points="25,35 75,35 85,85 15,85" fill="#0e233d" stroke="${color}" stroke-width="3.5"/>
            <!-- バイザーアイ -->
            <polygon points="32,45 68,45 64,55 36,55" fill="#ff0055"/>
            <!-- アーマープレート -->
            <line x1="28" y1="68" x2="72" y2="68" stroke="${color}" stroke-width="3"/>
            <circle cx="50" cy="76" r="5" fill="${accent}"/>
          </svg>
        `
        },
        {
          type: 'サイバービースト',
          tag: '獣型',
          render: (color, accent) => `
          <svg width="85" height="85" viewBox="0 0 100 100">
            <!-- 鋭いツノ -->
            <polygon points="30,10 40,35 25,32" fill="${accent}"/>
            <polygon points="70,10 75,32 60,35" fill="${accent}"/>
            <!-- 狼ヘッド -->
            <polygon points="50,25 78,45 70,80 50,92 30,80 22,45" fill="#132742" stroke="${color}" stroke-width="3.5"/>
            <!-- 鋭い双眼 -->
            <polygon points="36,46 46,50 38,54" fill="#00ff66"/>
            <polygon points="64,46 62,54 54,50" fill="#00ff66"/>
            <!-- メカファング（牙） -->
            <polygon points="44,72 50,82 46,72" fill="#fff"/>
            <polygon points="56,72 54,72 50,82" fill="#fff"/>
          </svg>
        `
        },
        {
          type: 'サンダードラゴン',
          tag: '飛行竜型',
          render: (color, accent) => `
          <svg width="85" height="85" viewBox="0 0 100 100">
            <!-- 巨大な翼 -->
            <polygon points="50,45 5,20 15,65" fill="#1a3d66" stroke="${accent}" stroke-width="2"/>
            <polygon points="50,45 85,65 95,20" fill="#1a3d66" stroke="${accent}" stroke-width="2"/>
            <!-- ドラゴンヘッド -->
            <polygon points="50,15 68,40 60,78 50,95 40,78 32,40" fill="#0a1d35" stroke="${color}" stroke-width="3.5"/>
            <!-- ドラゴンアイ -->
            <circle cx="42" cy="48" r="4" fill="#ffd700"/>
            <circle cx="58" cy="48" r="4" fill="#ffd700"/>
            <!-- プラズマホーン -->
            <line x1="50" y1="20" x2="50" y2="5" stroke="#00e5ff" stroke-width="3" stroke-linecap="round"/>
          </svg>
        `
        },
        {
          type: 'オメガエンペラー',
          tag: '皇帝型BOSS',
          render: (color, accent) => `
          <svg width="85" height="85" viewBox="0 0 100 100">
            <!-- 王冠パーツ -->
            <polygon points="30,15 40,28 50,10 60,28 70,15 65,35 35,35" fill="${accent}" stroke="#fff" stroke-width="1.5"/>
            <!-- 皇帝ボディ -->
            <polygon points="25,35 75,35 88,85 50,95 12,85" fill="#1a0f28" stroke="${color}" stroke-width="3.5"/>
            <!-- プラズマジェネレーターコア -->
            <circle cx="50" cy="62" r="14" fill="#06020c" stroke="#ff0055" stroke-width="2"/>
            <circle cx="50" cy="62" r="7" fill="#ff0055"/>
            <!-- 鋭いバイザー -->
            <line x1="34" y1="45" x2="66" y2="45" stroke="#00ffcc" stroke-width="4" stroke-linecap="round"/>
          </svg>
        `
        }
      ];

      const COLOR_THEMES = [
        { color: '#00e5ff', accent: '#ffd700' },
        { color: '#ff0055', accent: '#00ffcc' },
        { color: '#00ff66', accent: '#ff0055' },
        { color: '#ffaa00', accent: '#00e5ff' },
        { color: '#b700ff', accent: '#ffd700' }
      ];

      // --- 成績データの永続保存（localStorage） ---
      const STORAGE_KEY = 'kuku_battle_nine_save_v1';

      function loadGameData() {
        const defaultData = {
          level: 1,
          exp: 0,
          totalAttempts: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          highestCombo: 0,
          danStats: {
            1: { attempts: 0, correct: 0 },
            2: { attempts: 0, correct: 0 },
            3: { attempts: 0, correct: 0 },
            4: { attempts: 0, correct: 0 },
            5: { attempts: 0, correct: 0 },
            6: { attempts: 0, correct: 0 },
            7: { attempts: 0, correct: 0 },
            8: { attempts: 0, correct: 0 },
            9: { attempts: 0, correct: 0 }
          }
        };

        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return defaultData;
          const parsed = JSON.parse(raw);
          return { ...defaultData, ...parsed };
        } catch (e) {
          return defaultData;
        }
      }

      function saveGameData(data) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
          console.error(e);
        }
      }

      let UserData = loadGameData();

      // --- ゲームランタイム状態 ---
      const State = {
        mode: 'random',
        selectedDan: 2,
        currentQuestionIdx: 0,
        totalQuestions: 10,
        qNum1: 1,
        qNum2: 1,
        correctAnswer: 1,
        inputBuffer: '',
        score: 0,
        combo: 0,
        maxCombo: 0,
        correctCount: 0,
        roundAttempts: 0,
        startTime: 0,
        timerSec: 60,
        timerInterval: null,
        questionList: []
      };

      // DOM要素
      const dom = {
        titleScreen: document.getElementById('titleScreen'),
        battleScreen: document.getElementById('battleScreen'),
        resultScreen: document.getElementById('resultScreen'),
        levelUpModal: document.getElementById('levelUpModal'),
        modalCloseBtn: document.getElementById('modalCloseBtn'),
        modalLevelNum: document.getElementById('modalLevelNum'),
        modalTitleName: document.getElementById('modalTitleName'),
        titleListModal: document.getElementById('titleListModal'),
        titleListCloseBtn: document.getElementById('titleListCloseBtn'),
        titleListCloseBtnTop: document.getElementById('titleListCloseBtnTop'),
        titleListItems: document.getElementById('titleListItems'),
        tlCurrentLevel: document.getElementById('tlCurrentLevel'),
        tlNextTitleHint: document.getElementById('tlNextTitleHint'),
        tlCurrentTitle: document.getElementById('tlCurrentTitle'),
        pilotTitleTagBtn: document.getElementById('pilotTitleTagBtn'),
        soundToggleBtn: document.getElementById('soundToggleBtn'),
        soundIcon: document.getElementById('soundIcon'),
        soundText: document.getElementById('soundText'),
        resetDataBtn: document.getElementById('resetDataBtn'),
        startAttackBtn: document.getElementById('startAttackBtn'),
        startRandomBtn: document.getElementById('startRandomBtn'),
        danGrid: document.getElementById('danGrid'),
        pilotLevelNum: document.getElementById('pilotLevelNum'),
        pilotTitleName: document.getElementById('pilotTitleName'),
        pilotExpCur: document.getElementById('pilotExpCur'),
        pilotExpNext: document.getElementById('pilotExpNext'),
        pilotExpPercent: document.getElementById('pilotExpPercent'),
        pilotExpBar: document.getElementById('pilotExpBar'),
        statTotalAttempts: document.getElementById('statTotalAttempts'),
        statAccuracy: document.getElementById('statAccuracy'),
        statMaxCombo: document.getElementById('statMaxCombo'),
        modeInfoLabel: document.getElementById('modeInfoLabel'),
        questionProgress: document.getElementById('questionProgress'),
        comboCount: document.getElementById('comboCount'),
        timerLabel: document.getElementById('timerLabel'),
        timerValue: document.getElementById('timerValue'),
        scoreValue: document.getElementById('scoreValue'),
        enemyName: document.getElementById('enemyName'),
        enemyTypeTag: document.getElementById('enemyTypeTag'),
        enemyHpBar: document.getElementById('enemyHpBar'),
        enemySvgContainer: document.getElementById('enemySvgContainer'),
        attackSlash: document.getElementById('attackSlash'),
        qNum1: document.getElementById('qNum1'),
        qNum2: document.getElementById('qNum2'),
        answerDisplay: document.getElementById('answerDisplay'),
        kukuVoiceHint: document.getElementById('kukuVoiceHint'),
        keypadKeys: document.querySelectorAll('.num-key[data-key]'),
        keyClear: document.getElementById('keyClear'),
        keyEnter: document.getElementById('keyEnter'),
        feedbackToast: document.getElementById('feedbackToast'),
        retryBtn: document.getElementById('retryBtn'),
        backToTitleBtn: document.getElementById('backToTitleBtn'),
        inBattleQuitBtn: document.getElementById('inBattleQuitBtn'),
        resultRankBadge: document.getElementById('resultRankBadge'),
        resultTitle: document.getElementById('resultTitle'),
        resultSubtitle: document.getElementById('resultSubtitle'),
        resGainedExp: document.getElementById('resGainedExp'),
        resCorrect: document.getElementById('resCorrect'),
        resMaxCombo: document.getElementById('resMaxCombo'),
        resScore: document.getElementById('resScore'),
        resTime: document.getElementById('resTime')
      };

      // 九九の正式な読み方テーブル（小学二年生の学習に準拠）
      const KUKU_TABLE = {
        1: {
          1: { q: 'いんいちが', full: 'いんいちが いち' },
          2: { q: 'いんにが', full: 'いんにが に' },
          3: { q: 'いんさんが', full: 'いんさんが さん' },
          4: { q: 'いんしが', full: 'いんしが し' },
          5: { q: 'いんごが', full: 'いんごが ご' },
          6: { q: 'いんろくが', full: 'いんろくが ろく' },
          7: { q: 'いんしちが', full: 'いんしちが しち' },
          8: { q: 'いんはちが', full: 'いんはちが はち' },
          9: { q: 'いんくが', full: 'いんくが く' }
        },
        2: {
          1: { q: 'にいちが', full: 'にいちが に' },
          2: { q: 'ににんが', full: 'ににんが し' },
          3: { q: 'にさんが', full: 'にさんが ろく' },
          4: { q: 'にしが', full: 'にしが はち' },
          5: { q: 'にご', full: 'にごじゅう' },
          6: { q: 'にろく', full: 'にろくじゅうに' },
          7: { q: 'にしち', full: 'にしちじゅうし' },
          8: { q: 'にはち', full: 'にはちじゅうろく' },
          9: { q: 'にく', full: 'にくじゅうはち' }
        },
        3: {
          1: { q: 'さんいちが', full: 'さんいちが さん' },
          2: { q: 'さんにが', full: 'さんにが ろく' },
          3: { q: 'さざんが', full: 'さざんが く' },
          4: { q: 'さんし', full: 'さんしじゅうに' },
          5: { q: 'さんご', full: 'さんごじゅうご' },
          6: { q: 'さぶろく', full: 'さぶろくじゅうはち' },
          7: { q: 'さんしち', full: 'さんしちにじゅういち' },
          8: { q: 'さんぱ', full: 'さんぱにじゅうし' },
          9: { q: 'さんく', full: 'さんくにじゅうしち' }
        },
        4: {
          1: { q: 'しいちが', full: 'しいちが し' },
          2: { q: 'しにが', full: 'しにが はち' },
          3: { q: 'しさん', full: 'しさんじゅうに' },
          4: { q: 'しし', full: 'ししじゅうろく' },
          5: { q: 'しご', full: 'しごにじゅう' },
          6: { q: 'しろく', full: 'しろくにじゅうし' },
          7: { q: 'ししち', full: 'ししちにじゅうはち' },
          8: { q: 'しは', full: 'しはさんじゅうに' },
          9: { q: 'しく', full: 'しくさんじゅうろく' }
        },
        5: {
          1: { q: 'ごいちが', full: 'ごいちが ご' },
          2: { q: 'ごに', full: 'ごにじゅう' },
          3: { q: 'ごさん', full: 'ごさんじゅうご' },
          4: { q: 'ごし', full: 'ごしにじゅう' },
          5: { q: 'ごご', full: 'ごごにじゅうご' },
          6: { q: 'ごろく', full: 'ごろくさんじゅう' },
          7: { q: 'ごしち', full: 'ごしちさんじゅうご' },
          8: { q: 'ごは', full: 'ごはしじゅう' },
          9: { q: 'ごく', full: 'ごくじゅうご' }
        },
        6: {
          1: { q: 'ろくいちが', full: 'ろくいちが ろく' },
          2: { q: 'ろくに', full: 'ろくにじゅうに' },
          3: { q: 'ろくさん', full: 'ろくさんじゅうはち' },
          4: { q: 'ろくし', full: 'ろくしにじゅうし' },
          5: { q: 'ろくご', full: 'ろくごさんじゅう' },
          6: { q: 'ろくろく', full: 'ろくろくさんじゅうろく' },
          7: { q: 'ろくしち', full: 'ろくしちしじゅうに' },
          8: { q: 'ろくは', full: 'ろくはしじゅうはち' },
          9: { q: 'ろっく', full: 'ろっくごじゅうし' }
        },
        7: {
          1: { q: 'しちいちが', full: 'しちいちが しち' },
          2: { q: 'しちに', full: 'しちにじゅうし' },
          3: { q: 'しちさん', full: 'しちさんにじゅういち' },
          4: { q: 'しちし', full: 'しちしにじゅうはち' },
          5: { q: 'しちご', full: 'しちごさんじゅうご' },
          6: { q: 'しちろく', full: 'しちろくしじゅうに' },
          7: { q: 'しちしち', full: 'しちしちしじゅうく' },
          8: { q: 'しちは', full: 'しちはごじゅうろく' },
          9: { q: 'しちく', full: 'しちくろくじゅうさん' }
        },
        8: {
          1: { q: 'はちいちが', full: 'はちいちが はち' },
          2: { q: 'はちに', full: 'はちにじゅうろく' },
          3: { q: 'はちさん', full: 'はちさんにじゅうし' },
          4: { q: 'はちし', full: 'はちしさんじゅうに' },
          5: { q: 'はちご', full: 'はちごしじゅう' },
          6: { q: 'はちろく', full: 'はちろくしじゅうはち' },
          7: { q: 'はちしち', full: 'はちしちごじゅうろく' },
          8: { q: 'はっぱ', full: 'はっぱろくじゅうし' },
          9: { q: 'はっく', full: 'はっくしちじゅうに' }
        },
        9: {
          1: { q: 'くいちが', full: 'くいちが く' },
          2: { q: 'くに', full: 'くにじゅうはち' },
          3: { q: 'くさん', full: 'くさんにじゅうしち' },
          4: { q: 'くし', full: 'くしさんじゅうろく' },
          5: { q: 'くご', full: 'くごしじゅうご' },
          6: { q: 'くろく', full: 'くろくごじゅうし' },
          7: { q: 'くしち', full: 'くしちろくじゅうさん' },
          8: { q: 'くは', full: 'くはしちじゅうに' },
          9: { q: 'くく', full: 'くくはちじゅういち' }
        }
      };

      function getKukuReading(a, b) {
        if (KUKU_TABLE[a] && KUKU_TABLE[a][b]) {
          return KUKU_TABLE[a][b].q;
        }
        return `${a} × ${b}`;
      }

      // --- UI更新：タイトル画面のパイロットステータス ---
      function updatePilotStatusUI() {
        dom.pilotLevelNum.textContent = UserData.level;
        dom.pilotTitleName.textContent = getTitleForLevel(UserData.level);

        const nextExp = getExpForNextLevel(UserData.level);
        dom.pilotExpCur.textContent = UserData.exp;
        dom.pilotExpNext.textContent = nextExp;

        const pct = Math.min(100, Math.round((UserData.exp / nextExp) * 100));
        dom.pilotExpPercent.textContent = `${pct}%`;
        dom.pilotExpBar.style.width = `${pct}%`;

        dom.statTotalAttempts.textContent = `${UserData.totalAttempts}回`;

        const acc = UserData.totalQuestions > 0
          ? Math.round((UserData.totalCorrect / UserData.totalQuestions) * 100)
          : 0;
        dom.statAccuracy.textContent = `${acc}%`;
        dom.statMaxCombo.textContent = UserData.highestCombo;

        // 段選択グリッドの更新
        renderDanGrid();
      }

      function renderDanGrid() {
        const danTips = {
          1: '基本', 2: 'ににんがし', 3: 'さざんがきゅう',
          4: 'しし16', 5: 'ごご25', 6: 'ろくろく36',
          7: 'しちしち49', 8: 'はっぱ64', 9: 'くく81'
        };

        dom.danGrid.innerHTML = '';
        for (let d = 1; d <= 9; d++) {
          const btn = document.createElement('button');
          btn.className = 'dan-btn';
          btn.dataset.dan = d;

          const dStat = UserData.danStats && UserData.danStats[d] ? UserData.danStats[d] : { attempts: 0, correct: 0 };
          const dAcc = dStat.attempts > 0 ? Math.round((dStat.correct / dStat.attempts) * 100) : null;

          btn.innerHTML = `
          <span>${d}の<ruby>段<rt>だん</rt></ruby></span>
          <span class="dan-badge">${danTips[d]}</span>
          ${dAcc !== null ? `<span class="dan-rate">正解率:${dAcc}%</span>` : ''}
        `;

          btn.addEventListener('click', () => {
            startBattle('dan', d);
          });

          dom.danGrid.appendChild(btn);
        }
      }

      // 画面切り替え
      function switchScreen(screen) {
        [dom.titleScreen, dom.battleScreen, dom.resultScreen].forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
      }

      // サウンドトグル
      dom.soundToggleBtn.addEventListener('click', () => {
        sound.init();
        const isSoundOn = sound.toggleMute();
        dom.soundIcon.textContent = isSoundOn ? '🔊' : '🔇';
        dom.soundText.innerHTML = isSoundOn ? '<ruby>音<rt>おと</rt></ruby> ON' : '<ruby>音<rt>おと</rt></ruby> OFF';
      });

      // データリセット（設定ボタン）
      dom.resetDataBtn.addEventListener('click', () => {
        if (confirm('これまでのレベルや成績データをリセットしますか？')) {
          localStorage.removeItem(STORAGE_KEY);
          UserData = loadGameData();
          updatePilotStatusUI();
          alert('データをリセットしました！');
        }
      });

      // モード開始
      dom.startAttackBtn.addEventListener('click', () => startBattle('attack'));
      dom.startRandomBtn.addEventListener('click', () => startBattle('random'));

      dom.retryBtn.addEventListener('click', () => {
        startBattle(State.mode, State.selectedDan);
      });

      dom.backToTitleBtn.addEventListener('click', () => {
        clearInterval(State.timerInterval);
        sound.stopBgm();
        updatePilotStatusUI();
        switchScreen(dom.titleScreen);
      });

      dom.inBattleQuitBtn.addEventListener('click', () => {
        sound.init();
        if (confirm('バトルをやめて、タイトル画面にもどる？')) {
          clearInterval(State.timerInterval);
          sound.stopBgm();
          updatePilotStatusUI();
          switchScreen(dom.titleScreen);
        }
      });

      dom.modalCloseBtn.addEventListener('click', () => {
        dom.levelUpModal.classList.remove('active');
      });

      // --- 称号コレクション一覧モーダル ---
      function openTitleListModal() {
        sound.init();
        sound.playKey();

        const curLv = UserData.level;
        const curTitle = getTitleForLevel(curLv);
        dom.tlCurrentLevel.textContent = `Lv.${curLv}`;
        dom.tlCurrentTitle.textContent = curTitle;

        // 次の称号を検索
        let nextTitle = null;
        for (const t of TITLES) {
          if (t.lv > curLv) {
            nextTitle = t;
            break;
          }
        }

        if (nextTitle) {
          const diff = nextTitle.lv - curLv;
          dom.tlNextTitleHint.innerHTML = `つぎの称号まで あと <strong style="color:#00ffcc; font-size:0.95rem;">${diff}</strong> Lv（Lv.${nextTitle.lv} で解放）`;
        } else {
          dom.tlNextTitleHint.innerHTML = '✨ すべての称号を 完全制覇した！ ✨';
        }

        // 称号リスト描画
        dom.titleListItems.innerHTML = '';
        TITLES.forEach(t => {
          const item = document.createElement('div');
          const isCurrent = (t.title === curTitle);
          const isUnlocked = (curLv >= t.lv);

          let statusClass = 'locked';
          let badgeHtml = '';

          if (isCurrent) {
            statusClass = 'current';
            badgeHtml = '<span style="background:#ffd700; color:#000; font-size:0.68rem; font-weight:900; padding:2px 8px; border-radius:12px; box-shadow:0 0 8px rgba(255,215,0,0.5);">⭐ いまの称号</span>';
          } else if (isUnlocked) {
            statusClass = 'unlocked';
            badgeHtml = '<span style="background:#0f304d; border:1px solid #00e5ff; color:#00e5ff; font-size:0.68rem; font-weight:bold; padding:2px 8px; border-radius:12px;">✅ 獲得ずみ</span>';
          } else {
            statusClass = 'locked';
            const rem = t.lv - curLv;
            badgeHtml = `<span style="background:#151c27; border:1px dashed #4e6785; color:#8fa7c2; font-size:0.68rem; padding:2px 8px; border-radius:12px;">🔒 Lv.${t.lv}（あと ${rem} Lv）</span>`;
          }

          item.className = `title-item-card ${statusClass}`;
          item.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:baseline; gap:6px;">
              <span style="font-family:monospace; font-weight:bold; color:${isUnlocked ? '#ffd700' : '#647c94'}; font-size:0.95rem;">Lv.${t.lv}</span>
              <strong style="font-size:1.05rem; color:${isUnlocked ? '#fff' : '#8899aa'};">${t.title}</strong>
            </div>
            ${badgeHtml}
          </div>
          <div style="font-size:0.75rem; color:${isUnlocked ? '#b1c8df' : '#5a6d80'}; margin-top:2px;">
            ${t.desc}
          </div>
        `;

          dom.titleListItems.appendChild(item);
        });

        dom.titleListModal.classList.add('active');
      }

      dom.pilotTitleTagBtn.addEventListener('click', openTitleListModal);
      dom.titleListCloseBtn.addEventListener('click', () => dom.titleListModal.classList.remove('active'));
      dom.titleListCloseBtnTop.addEventListener('click', () => dom.titleListModal.classList.remove('active'));

      // 問題生成
      function generateQuestions(mode, dan = 2) {
        const questions = [];
        if (mode === 'dan') {
          for (let b = 1; b <= 9; b++) {
            questions.push({ a: dan, b: b, ans: dan * b });
          }
          for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
          }
        } else if (mode === 'random') {
          for (let i = 0; i < 10; i++) {
            const a = Math.floor(Math.random() * 9) + 1;
            const b = Math.floor(Math.random() * 9) + 1;
            questions.push({ a: a, b: b, ans: a * b });
          }
        } else if (mode === 'attack') {
          for (let i = 0; i < 70; i++) {
            const a = Math.floor(Math.random() * 9) + 1;
            const b = Math.floor(Math.random() * 9) + 1;
            questions.push({ a: a, b: b, ans: a * b });
          }
        }
        return questions;
      }

      // バトル開始
      function startBattle(mode, dan = 2) {
        sound.init();
        sound.playTone(440, 'sine', 0.1);
        sound.startBgm(mode === 'attack');

        State.mode = mode;
        State.selectedDan = dan;
        State.questionList = generateQuestions(mode, dan);
        State.currentQuestionIdx = 0;
        State.score = 0;
        State.combo = 0;
        State.maxCombo = 0;
        State.correctCount = 0;
        State.roundAttempts = 0;
        State.inputBuffer = '';
        State.startTime = Date.now();

        clearInterval(State.timerInterval);

        if (mode === 'attack') {
          State.timerSec = 60;
          dom.timerLabel.innerHTML = '<ruby>残<rt>のこ</rt></ruby>り<ruby>秒<rt>びょう</rt></ruby>';
          dom.timerValue.textContent = State.timerSec;
          dom.modeInfoLabel.innerHTML = '<ruby>撃破数<rt>げきはすう</rt></ruby>';
          dom.questionProgress.innerHTML = '0 <small style="font-size:0.65em;"><ruby>体<rt>たい</rt></ruby></small>';
          State.timerInterval = setInterval(() => {
            State.timerSec--;
            dom.timerValue.textContent = State.timerSec;
            if (State.timerSec <= 5 && State.timerSec > 0) {
              sound.playTone(330, 'square', 0.1);
            }
            if (State.timerSec <= 0) {
              clearInterval(State.timerInterval);
              finishGame();
            }
          }, 1000);
        } else {
          State.totalQuestions = State.questionList.length;
          dom.timerLabel.innerHTML = '<ruby>経過<rt>けいか</rt></ruby>';
          dom.timerValue.textContent = '0s';
          dom.modeInfoLabel.innerHTML = '<ruby>問題<rt>もんだい</rt></ruby>';
          dom.questionProgress.textContent = `1 / ${State.totalQuestions}`;
          State.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - State.startTime) / 1000);
            dom.timerValue.textContent = `${elapsed}s`;
          }, 1000);
        }

        updateStatusUI();
        loadQuestion();
        switchScreen(dom.battleScreen);
      }

      // 敵のビジュアル更新
      function updateEnemyVisual(questionIdx) {
        // 敵の種類を進行度やレベルでローテーション
        const speciesIdx = questionIdx % ENEMY_SPECIES.length;
        const themeIdx = (questionIdx + UserData.level) % COLOR_THEMES.length;

        const species = ENEMY_SPECIES[speciesIdx];
        const theme = COLOR_THEMES[themeIdx];

        dom.enemyName.innerHTML = `<span>🤖</span> <ruby>${species.type}<rt>エネミー</rt></ruby> Lv.${questionIdx + 1}`;
        dom.enemyTypeTag.textContent = species.tag;
        dom.enemyTypeTag.style.borderColor = theme.color;
        dom.enemyTypeTag.style.color = theme.color;

        dom.enemySvgContainer.innerHTML = species.render(theme.color, theme.accent);
        dom.enemyHpBar.style.width = '100%';
      }

      // 現在の問題をロード
      function loadQuestion() {
        if (State.mode !== 'attack' && State.currentQuestionIdx >= State.questionList.length) {
          finishGame();
          return;
        }

        const q = State.questionList[State.currentQuestionIdx];
        State.qNum1 = q.a;
        State.qNum2 = q.b;
        State.correctAnswer = q.ans;

        dom.qNum1.textContent = q.a;
        dom.qNum2.textContent = q.b;
        dom.kukuVoiceHint.textContent = getKukuReading(q.a, q.b);

        State.inputBuffer = '';
        updateInputDisplay();

        updateEnemyVisual(State.currentQuestionIdx);

        if (State.mode !== 'attack') {
          dom.questionProgress.textContent = `${State.currentQuestionIdx + 1} / ${State.totalQuestions}`;
        } else {
          dom.questionProgress.innerHTML = `${State.correctCount} <small style="font-size:0.65em;"><ruby>体<rt>たい</rt></ruby></small>`;
        }
      }

      function updateInputDisplay() {
        if (State.inputBuffer === '') {
          dom.answerDisplay.textContent = '?';
          dom.answerDisplay.classList.add('empty');
        } else {
          dom.answerDisplay.textContent = State.inputBuffer;
          dom.answerDisplay.classList.remove('empty');
        }
      }

      // テンキー
      dom.keypadKeys.forEach(btn => {
        btn.addEventListener('click', () => {
          const num = btn.dataset.key;
          if (State.inputBuffer.length < 3) {
            State.inputBuffer += num;
            sound.playKey();
            updateInputDisplay();
          }
        });
      });

      dom.keyClear.addEventListener('click', () => {
        State.inputBuffer = '';
        sound.playKey();
        updateInputDisplay();
      });

      dom.keyEnter.addEventListener('click', submitAnswer);

      // キーボード入力
      window.addEventListener('keydown', (e) => {
        if (!dom.battleScreen.classList.contains('active')) return;
        if (e.key >= '0' && e.key <= '9') {
          if (State.inputBuffer.length < 3) {
            State.inputBuffer += e.key;
            sound.playKey();
            updateInputDisplay();
          }
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'c' || e.key === 'C') {
          State.inputBuffer = '';
          sound.playKey();
          updateInputDisplay();
        } else if (e.key === 'Enter') {
          submitAnswer();
        }
      });

      function submitAnswer() {
        if (State.inputBuffer === '') return;
        State.roundAttempts++;
        const userAns = parseInt(State.inputBuffer, 10);

        // 段ごとの記録集計用
        const currentDan = State.qNum1;
        if (!UserData.danStats[currentDan]) {
          UserData.danStats[currentDan] = { attempts: 0, correct: 0 };
        }
        UserData.danStats[currentDan].attempts++;

        if (userAns === State.correctAnswer) {
          UserData.danStats[currentDan].correct++;
          handleCorrect();
        } else {
          handleWrong();
        }
      }

      function handleCorrect() {
        State.combo++;
        if (State.combo > State.maxCombo) State.maxCombo = State.combo;
        State.correctCount++;

        const comboBonus = (State.combo - 1) * 50;
        State.score += 100 + comboBonus;

        sound.playLaser();
        setTimeout(() => sound.playHit(), 100);
        sound.playCorrect(State.combo);

        // 斬撃とダメージ
        dom.attackSlash.classList.remove('active');
        void dom.attackSlash.offsetWidth;
        dom.attackSlash.classList.add('active');

        dom.enemySvgContainer.classList.add('hit');
        dom.enemyHpBar.style.width = '0%';
        setTimeout(() => dom.enemySvgContainer.classList.remove('hit'), 400);

        showToast('⭕ せいかい！', 'correct');
        updateStatusUI();

        setTimeout(() => {
          State.currentQuestionIdx++;
          loadQuestion();
        }, 500);
      }

      function handleWrong() {
        State.combo = 0;
        sound.playWrong();
        const kukuInfo = KUKU_TABLE[State.qNum1] && KUKU_TABLE[State.qNum1][State.qNum2];
        const hintText = kukuInfo ? `（${kukuInfo.full}）` : '';
        // 読み切れるように長め（2.5秒）に表示
        showToast(`❌ こたえは ${State.correctAnswer} ${hintText}`, 'wrong', 2500);
        updateStatusUI();
        State.inputBuffer = '';
        updateInputDisplay();
      }

      function updateStatusUI() {
        dom.comboCount.textContent = State.combo;
        dom.scoreValue.textContent = State.score.toLocaleString();
      }

      let toastTimeout = null;
      function showToast(text, type, duration = 800) {
        clearTimeout(toastTimeout);
        dom.feedbackToast.textContent = text;
        dom.feedbackToast.className = `feedback-toast ${type}`;
        toastTimeout = setTimeout(() => {
          dom.feedbackToast.className = 'feedback-toast';
        }, duration);
      }

      // --- ゲーム終了・成績集計とレベルアップ計算 ---
      function finishGame() {
        clearInterval(State.timerInterval);
        sound.stopBgm();
        sound.playFanfare();

        const elapsedSec = ((Date.now() - State.startTime) / 1000).toFixed(1);

        // 経験値（EXP）の計算（適正バランス化）
        let gainedExp = State.correctCount * 8;
        gainedExp += Math.round(State.maxCombo * 1.5);
        if (State.roundAttempts > 0 && State.correctCount === State.roundAttempts) {
          gainedExp += 15; // パーフェクトボーナス
        }
        if (State.mode === 'attack') {
          gainedExp += Math.round(State.correctCount * 3);
        }

        // ユーザーデータの集計・更新
        UserData.totalAttempts++;
        UserData.totalQuestions += Math.max(State.roundAttempts, State.correctCount);
        UserData.totalCorrect += State.correctCount;
        if (State.maxCombo > UserData.highestCombo) {
          UserData.highestCombo = State.maxCombo;
        }
        UserData.exp += gainedExp;

        // レベルアップ判定
        let leveledUp = false;
        let nextReq = getExpForNextLevel(UserData.level);
        while (UserData.exp >= nextReq) {
          UserData.exp -= nextReq;
          UserData.level++;
          leveledUp = true;
          nextReq = getExpForNextLevel(UserData.level);
        }

        // 保存
        saveGameData(UserData);

        // リザルト表示
        let rank = 'B';
        let title = '九九ファイター';
        let subtitle = 'がんばったね！もっと強くなれるぞ！';

        if (State.mode === 'attack') {
          dom.resCorrect.textContent = `${State.correctCount} 体撃破`;
          dom.resTime.textContent = '60秒';
          if (State.correctCount >= 25) {
            rank = 'SS';
            title = '⚡ 神速の九九マスター ⚡';
            subtitle = '全宇宙最強のスピード計算戦士！すごすぎる！';
          } else if (State.correctCount >= 18) {
            rank = 'S';
            title = '🔥 超光速の計算ヒーロー 🔥';
            subtitle = 'すさまじいスピード！敵メカも太刀打ちできない！';
          } else if (State.correctCount >= 10) {
            rank = 'A';
            title = '⭐ 九九エキスパート戦士 ⭐';
            subtitle = 'ナイスバトル！さらに上のランクをめざそう！';
          }
        } else {
          const accuracy = State.roundAttempts > 0
            ? Math.round((State.correctCount / State.roundAttempts) * 100)
            : 100;
          dom.resCorrect.textContent = `${State.correctCount}問 (${accuracy}%)`;
          dom.resTime.textContent = `${elapsedSec}秒`;

          if (accuracy === 100 && parseFloat(elapsedSec) <= 15) {
            rank = 'SS';
            title = '🏆 完全無欠の九九ゴッド 🏆';
            subtitle = 'パーフェクト＆ハイスピード！文句なしの九九マスター！';
          } else if (accuracy === 100) {
            rank = 'S';
            title = '✨ パーフェクトソルジャー ✨';
            subtitle = '全問正解！九九の力はカンペキだ！';
          } else if (accuracy >= 80) {
            rank = 'A';
            title = '🛡️ 九九マスター見習い 🛡️';
            subtitle = 'あと少しでパーフェクト！次は満点をねらおう！';
          }
        }

        dom.resultRankBadge.textContent = rank;
        dom.resultTitle.textContent = title;
        dom.resultSubtitle.textContent = subtitle;
        dom.resGainedExp.textContent = `+${gainedExp} EXP`;
        dom.resMaxCombo.textContent = State.maxCombo;
        dom.resScore.textContent = State.score.toLocaleString();

        switchScreen(dom.resultScreen);

        // レベルアップ演出モーダル表示
        if (leveledUp) {
          setTimeout(() => {
            sound.playLevelUp();
            dom.modalLevelNum.textContent = `Lv.${UserData.level}`;
            dom.modalTitleName.textContent = getTitleForLevel(UserData.level);
            dom.levelUpModal.classList.add('active');
          }, 600);
        }
      }

      // 初回初期化
      updatePilotStatusUI();
    