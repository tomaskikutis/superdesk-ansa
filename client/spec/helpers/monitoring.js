
'use strict';

var openUrl = require('./utils').open;
module.exports = new Monitoring();

function Monitoring() {

    var config = element(by.className('aggregate-settings'));

    this.openMonitoring = function() {
        openUrl('/#/workspace/monitoring');
    };

    this.openSpiked = function() {
        element(by.className('big-icon-spiked')).click();
    };

    /**
     * Open personal monitoring view
     */
    this.openPersonal = function() {
        element(by.className('big-icon-personal')).click();
    };

    /**
     * On monitoring view create a new item
     *
     * @param {string} action - the create item action can be: create_text_article,
     * create_preformatted_article and create_package
     */
    this.createItemAction = function(action) {
        element(by.className('svg-icon-plus')).click();
        element(by.id(action)).click();
        browser.sleep(500);
    };

    this.getGroup = function(group) {
        return this.getGroups().get(group);
    };

    this.getGroups = function() {
        return element.all(by.repeater('group in aggregate.groups'));
    };

    this.getItem = function(group, item) {
        return this.getGroup(group).all(by.repeater('item in items')).get(item);
    };

    this.getGroupItems = function(group) {
        return this.getGroup(group).all(by.repeater('item in items'));
    };

    this.getSpikedItems = function() {
        return element.all(by.repeater('item in items'));
    };

    /**
     * Get the personal element at 'index' row
     *
     * @param {number} index
     * @return {object}
     */
    this.getPersonalItem = function(index) {
        return element.all(by.repeater('item in items')).get(index);
    };

    /**
     * Get the personal element text at 'index' row
     *
     * @param {number} index
     * @return {string}
     */
    this.getPersonalItemText = function(index) {
        return this.getPersonalItem(index).element(by.id('title')).getText();
    };

    this.getSpikedItem = function(item) {
        return this.getSpikedItems().get(item);
    };

    this.getItemText = function(item) {
        return item.element(by.id('title')).getText();
    };

    this.getTextItem = function(group, item) {
        return this.getItem(group, item).element(by.id('title')).getText();
    };

    this.searchAction = function(search) {
        element(by.css('.flat-searchbar')).click();
        element(by.model('query')).sendKeys(search);
    };

    /**
     * Perform filter by filterType that can be
     * all, audio, video, text, picture and composite
     *
     * @param {string} fileType
     */
    this.filterAction = function(fileType) {
        element(by.className('filetype-icon-' + fileType)).click();
    };

    this.previewAction = function(group, item) {
        this.getItem(group, item).click();
    };

    this.getPreviewTitle = function() {
        return element(by.css('.content-container'))
        .element(by.binding('selected.preview.headline'))
        .getText();
    };

    this.openAction = function(group, item) {
        browser.actions().doubleClick(
                this.getItem(group, item)
        ).perform();
    };

    this.actionOnItem = function(action, group, item) {
        var menu = this.openItemMenu(group, item);
        return menu.element(by.partialLinkText(action)).click();
    };

    this.selectItem = function(group, item) {
        return this.selectGivenItem(this.getItem(group, item));
    };

    this.selectSpikedItem = function(item) {
        return this.selectGivenItem(this.getSpikedItem(item));
    };

    this.selectGivenItem = function(item) {
        var itemTypeIcon = item.element(by.css('.filetype-icon-text'));
        browser.actions().mouseMove(itemTypeIcon).perform();
        return item.element(by.model('item.selected')).click();
    };

    this.spikeMultipleItems = function() {
        return element(by.css('[ng-click="action.spikeItems()"]')).click();
    };

    this.unspikeMultipleItems = function() {
        return element(by.css('[ng-click="action.unspikeItems()"]')).click();
    };

    this.unspikeItem = function(item) {
        var itemElem = this.getSpikedItem(item);
        browser.actions().mouseMove(itemElem).perform();
        itemElem.element(by.className('icon-dots-vertical')).click();
        var menu = element(by.css('.dropdown-menu.open'));
        return menu.element(by.partialLinkText('Unspike')).click();
    };

    this.openItemMenu = function(group, item) {
        var itemElem = this.getItem(group, item);
        browser.actions().mouseMove(itemElem).perform();
        itemElem.element(by.className('icon-dots-vertical')).click();
        return element(by.css('.dropdown-menu.open'));
    };

    this.showMonitoringSettings = function() {
        element.all(by.className('icon-dots-vertical')).first().click();
        browser.wait(function() {
            return element(by.css('.icon-settings')).isDisplayed();
        });
        element(by.css('.icon-settings')).click();
        browser.wait(function() {
            return element.all(by.css('.aggregate-widget-config')).isDisplayed();
        });
        element.all(by.css('[ng-click="goTo(step)"]')).first().click();
    };

    this.nextStages = function() {
        element(by.id('nextStages')).click();
        browser.sleep(500);
    };

    this.nextSearches = function() {
        element(by.id('nextSearches')).click();
        browser.sleep(500);
    };

    this.previousSearches = function() {
        element(by.id('previousSearches')).click();
        browser.sleep(500);
    };

    this.nextReorder = function() {
        element(by.id('nextReorder')).click();
        browser.sleep(500);
    };

    this.previousReorder = function() {
        element(by.id('previousReorder')).click();
        browser.sleep(500);
    };

    this.previousMax = function() {
        element(by.id('previousMax')).click();
        browser.sleep(500);
    };

    this.cancelSettings = function() {
        element(by.css('[ng-click="cancel()"]')).click();
    };

    this.saveSettings = function() {
        element(by.css('[ng-click="save()"]')).click();
    };

    this.getDesk = function(desk) {
        return config.all(by.repeater('desk in desks')).get(desk);
    };

    this.getStage = function(desk, stage) {
        return this.getDesk(desk).all(by.repeater('stage in deskStages[desk._id]')).get(stage);
    };

    this.getSearch = function(search) {
        return config.all(by.repeater('search in currentSavedSearches')).get(search);
    };

    this.getSearchText = function(search) {
        return this.getSearch(search).element(by.css('.desk-title')).getText();
    };

    this.toggleDesk = function(desk) {
        this.getDesk(desk).element(by.model('editGroups[desk._id].selected')).click();
    };

    this.toggleStage = function(desk, stage) {
        this.getStage(desk, stage).element(by.css('[ng-click="setStageInfo(stage._id)"]')).click();
    };

    this.togglePersonal = function() {
        element(by.css('[ng-click="setPersonalInfo()"]')).click();
    };

    this.toggleSearch = function(search) {
        this.getSearch(search).element(by.css('[ng-click="setSearchInfo(search._id)"]')).click();
    };

    this.toggleAllSearches = function() {
        element(by.css('[ng-click="initSavedSearches(showAllSavedSearches)"]')).click();
    };

    this.getOrderItem = function(item) {
        return element.all(by.repeater('item in getValues()')).get(item);
    };

    this.getOrderItemText = function(item) {
        return this.getOrderItem(item).element(by.css('.group-title')).getText();
    };

    this.moveOrderItem = function(start, end) {
        var src = this.getOrderItem(start);
        var dst = this.getOrderItem(end);
        return src.waitReady().then(function() {
            browser.actions()
                .mouseMove(src, {x: 0, y: 0})
                .mouseDown()
                .perform()
                .then(function() {
                    dst.waitReady().then(function () {
                        browser.actions()
                            .mouseMove(dst, {x: 5, y: 5})
                            .mouseUp()
                            .perform();
                    });
                });
        });
    };

    this.getMaxItem = function(item) {
        return element.all(by.repeater('max in getValues()')).get(item);
    };

    this.setMaxItems = function(item, value) {
        var maxItemsInput = this.getMaxItem(item).element(by.id('maxItems'));
        maxItemsInput.clear();
        maxItemsInput.sendKeys(value);
    };

    this.hasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    this.showHideList = function() {
        element(by.className('big-icon-view')).click();
    };

    this.openCreateMenu = function() {
        element(by.className('sd-create-btn')).click();
        browser.sleep(100);
    };

    this.startUpload = function() {
        element(by.id('start-upload-btn')).click();
    };

    this.uploadModal = element(by.className('upload-media'));
}
