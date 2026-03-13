// UFC Ruban — Discord Embed Builder
// discord.js v13 ONLY — never use GatewayIntentBits (v14 syntax)

const { MessageEmbed } = require('discord.js');

const COLORS = {
  LOCK: 0x00C851,    // Green
  LEAN: 0x2196F3,    // Blue
  'TOSS-UP': 0xFF9800, // Orange
  HEADER: 0xE8002A,  // UFC Red
  ERROR: 0xFF4444,
  PARLAY: 0xAA00FF,
};

const TIER_LABELS = {
  LOCK: '🔒 LOCK',
  LEAN: '✅ LEAN',
  'TOSS-UP': '⚖️ TOSS-UP',
};

function confidenceBar(confidence, width = 16) {
  const filled = Math.round((confidence / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function buildHeaderEmbed(results) {
  return new MessageEmbed()
    .setColor(COLORS.HEADER)
    .setTitle(`🥊 UFC RUBAN — ${results.event_name.toUpperCase()}`)
    .setDescription([
      `📅 **${results.event_date}** · 📍 ${results.location}`,
      ``,
      `**${results.predictions.length} fight predictions** ready.`,
      results.errors.length > 0
        ? `⚠️ ${results.errors.length} fight(s) missing data — run \`fix_missing_stats.py\``
        : `✅ Full card coverage`,
      ``,
      `*Built on data. Backed by odds. Honest about uncertainty.*`,
    ].join('\n'))
    .setFooter({ text: 'UFC Ruban · Predictions are probabilistic, not guarantees.' })
    .setTimestamp();
}

function buildFightEmbed(pred) {
  const tier = pred.tier;
  const color = COLORS[tier] || COLORS.LEAN;
  const tierLabel = TIER_LABELS[tier] || tier;
  const bar = confidenceBar(pred.confidence);

  const methodLine = `📋 **Method:** ${pred.method}`;
  const breakdownLine = [
    `📊 **Probability Breakdown**`,
    `\`KO/TKO:     ${String(pred.method_ko_pct).padStart(3)}%  ${confidenceBar(pred.method_ko_pct, 10)}\``,
    `\`Submission: ${String(pred.method_sub_pct).padStart(3)}%  ${confidenceBar(pred.method_sub_pct, 10)}\``,
    `\`Decision:   ${String(pred.method_dec_pct).padStart(3)}%  ${confidenceBar(pred.method_dec_pct, 10)}\``,
  ].join('\n');

  const keyFactors = pred.key_edge
    .map(e => `→ ${e}`)
    .join('\n');

  const titleTag = pred.is_title_fight ? ' 🏆' : '';
  const mainEventTag = pred.is_main_event ? ' ★ MAIN EVENT' : '';

  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(`🥊 ${pred.fighter1} vs ${pred.fighter2}${titleTag}`)
    .setDescription([
      `**${pred.weight_class}**${mainEventTag}`,
      ``,
      `${tierLabel}: **${pred.winner}** · ${pred.confidence.toFixed(0)}% confidence`,
      `\`${bar}\` ${pred.confidence.toFixed(0)}%`,
      ``,
      methodLine,
      ``,
      breakdownLine,
    ].join('\n'))
    .addField('💡 Key Factors', keyFactors)
    .addField('📝 Analysis', pred.analysis);

  if (pred.risk_flag) {
    embed.addField('⚠️ Risk', pred.risk_flag);
  }

  return embed;
}

function buildMainCardEmbeds(predictions) {
  // Main event gets full embed, rest get condensed
  const mainEvent = predictions.find(p => p.is_main_event) || predictions[0];
  const rest = predictions.filter(p => !p.is_main_event);

  const embeds = [];

  // Main event — full format
  if (mainEvent) {
    embeds.push(buildFightEmbed(mainEvent));
  }

  // Rest of main card — condensed multi-fight embed
  if (rest.length > 0) {
    const lines = rest.map(pred => {
      const tier = TIER_LABELS[pred.tier] || pred.tier;
      const bar = confidenceBar(pred.confidence, 12);
      return [
        `**${pred.fighter1} vs ${pred.fighter2}** · ${pred.weight_class}`,
        `${tier} → **${pred.winner}** (${pred.confidence.toFixed(0)}%) · ${pred.method}`,
        `\`${bar}\``,
        pred.key_edge[0] ? `→ ${pred.key_edge[0]}` : '',
        '',
      ].filter(Boolean).join('\n');
    });

    const cardEmbed = new MessageEmbed()
      .setColor(COLORS.HEADER)
      .setTitle('📋 Full Card Predictions')
      .setDescription(lines.join('\n').slice(0, 4096));

    embeds.push(cardEmbed);
  }

  return embeds;
}

function buildParlayEmbed(parlays) {
  if (!parlays.two_leg && !parlays.three_leg) return null;

  const embed = new MessageEmbed()
    .setColor(COLORS.PARLAY)
    .setTitle('🎯 Parlay Builder')
    .setDescription('Eligible picks: ≥60% confidence only. Combined probabilities shown.');

  if (parlays.two_leg) {
    const picks = parlays.two_leg.picks
      .map(p => `→ **${p.fighter}** (${p.confidence.toFixed(0)}%)`)
      .join('\n');
    embed.addField(
      `2-Leg Parlay · ${parlays.two_leg.combined_probability.toFixed(1)}% combined`,
      picks
    );
  }

  if (parlays.three_leg) {
    const picks = parlays.three_leg.picks
      .map(p => `→ **${p.fighter}** (${p.confidence.toFixed(0)}%)`)
      .join('\n');
    embed.addField(
      `3-Leg Parlay · ${parlays.three_leg.combined_probability.toFixed(1)}% combined`,
      picks
    );
  }

  embed.setFooter({ text: 'Parlay probabilities are independent-event estimates. Parlays carry compounded variance.' });
  return embed;
}

function buildErrorEmbed(errors) {
  if (!errors.length) return null;

  const lines = errors.map(e => `• ${e.message || e.missing_fighters?.join(', ')}`);
  return new MessageEmbed()
    .setColor(COLORS.ERROR)
    .setTitle('⚠️ Missing Fighter Data')
    .setDescription([
      'Run `python fix_missing_stats.py` to resolve:',
      '',
      ...lines,
    ].join('\n'));
}

function buildFooterEmbed() {
  return new MessageEmbed()
    .setColor(0x333333)
    .setDescription([
      '**UFC Ruban** · Built on data. Backed by odds. Honest about uncertainty.',
      '',
      '📊 Predictions use a 4-layer signal stack: Ensemble ML + Market Consensus + ELO + AI Review',
      '🔒 LOCK ≥65% · ✅ LEAN ≥54% · ⚖️ TOSS-UP <54%',
      '⚠️ Max confidence cap: 76%. Inflation destroys credibility.',
      '',
      '🔗 Full card + analysis: *Subscribe at UFC Ruban*',
    ].join('\n'));
}

module.exports = {
  buildHeaderEmbed,
  buildFightEmbed,
  buildMainCardEmbeds,
  buildParlayEmbed,
  buildErrorEmbed,
  buildFooterEmbed,
  COLORS,
};
