(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  window.displayPinnedCards = function(cards) {
    if (!cards || cards.length === 0) return null;
    var scenes = window.dendryUI.dendryEngine.game.scenes;

    var deckLike = [];
    var normal = [];
    for (var card of cards) {
        var scene = scenes[card.id];
        if (scene && scene.tags && scene.tags.indexOf('false-deck') !== -1) {
            deckLike.push(card);
        } else {
            normal.push(card);
        }
    }

    if (deckLike.length > 0) {
        var $decksEl = $('#content .decks').last();
        if ($decksEl.length === 0) {
            $decksEl = $('<ul>').addClass('decks');
            $('#content').append($decksEl);
        }
        for (var card of deckLike) {
            var $cardEl = $('<li>').addClass('deck pinned-card');
            var $cardLink = $('<a>').addClass('card').attr({href: '#', 'card-id': card.id, title: card.title});
            var $title = $('<span>').addClass('card-caption').text(card.title);
            if (card.image) {
                $cardLink.append($('<img>').addClass('card-img').attr({src: card.image}));
            }
            if (card.subtitle) {
                $cardLink.append($('<span>').addClass('card-tooltip').text(card.subtitle));
            }
            $cardEl.append($cardLink).append($title);
            $decksEl.append($cardEl);
        }
    }

    if (normal.length > 0) {
        var pinnedCardsDescription = 'Pinned cards - click a card to play.';
        if (window.pinnedCardsDescription) {
            pinnedCardsDescription = window.pinnedCardsDescription;
        }
        if (window.dendryUI.dendryEngine.state.qualities.pinnedCardsDescription) {
            pinnedCardsDescription = window.dendryUI.dendryEngine.state.qualities.pinnedCardsDescription;
        }
        $('#content').append($('<hr>'));
        $('#content').append($('<p>').addClass('pinned-text-description').text(pinnedCardsDescription));
        var $cardsEl = $('<ul>').addClass('pinned-cards');
        for (var card of normal) {
            var $cardEl = $('<li>').addClass('pinned-card');
            var $cardLink = $('<a>').addClass('card').attr({href: '#', 'card-id': card.id, title: card.title});
            var $title = $('<span>').addClass('card-caption').text(card.title);
            if (card.image) {
                $cardLink.append($('<img>').addClass('card-img').attr({src: card.image}));
            }
            if (card.subtitle) {
                $cardLink.append($('<span>').addClass('card-tooltip').text(card.subtitle));
            }
            $cardEl.append($cardLink).append($title);
            $cardsEl.append($cardEl);
        }
        $('#content').append($cardsEl);
    }
};

  document.addEventListener('click', function(event) {
    var link = event.target.closest && event.target.closest('a[card-id]');
    if (!link) return;
    var li = link.closest('li.pinned-card');
    if (!li || !li.classList.contains('deck')) return;
    var content = document.getElementById('content');
    if (!content || !content.contains(li)) return;
    event.preventDefault();
    event.stopPropagation();
    window.dendryUI.dendryEngine.playPinnedCard(link.getAttribute('card-id'));
  }, true); // true = capture phase, runs before browser.js's bubble-phase handler

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function (text) {
      return applyWholesome(text);
  };
  
  function applyWholesome(str) {
      const allWords = new Set([
          ...tooltipList.map(t => t.searchString),
          ...colourList.map(c => c.word)
      ]);
  
      const regex = new RegExp(`\\b(${[...allWords].join('|')})\\b`, 'g');
  
      return str.replace(/(<(?:span|strong)[^>]*>.*?<\/(?:span|strong)>|<[^>]+>|[^<]+)/g, (segment) => {
          if (segment.startsWith('<')) return segment;
  
          return segment.replace(regex, (match) => {
              const tooltip = tooltipList.find(t => t.searchString === match);
              const colour = colourList.find(c => c.word === match);
  
              let style = colour ? colour.style : '';
              let innerText = match;
  
              if (colour && colour.img) {
                  innerText = `<img src="${colour.img}" class="p_icon" alt="">${innerText}`;
              }
  
              if (tooltip) {
                  return `<span class='mytooltip' style='${style}'>${innerText}<span  class='mytooltiptext'>${tooltip.explanationText}</span></span>`;
              } else if (colour) {
                  return `<span style='${style}'>${innerText}</span>`;
              }
  
              return match;
          });
      });
  }

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
      window.updateSidebar();
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

}());

document.addEventListener('mousemove', e => {
    document.querySelectorAll('.mytooltiptext').forEach(el => {
        el.style.setProperty('--mouse-x', e.clientX + 'px');
        el.style.setProperty('--mouse-y', e.clientY + 'px');
    });
});
