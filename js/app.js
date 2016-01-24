(function ($) {

    var Cage = Backbone.Model.extend({
        defaults: {
            gsx$imghref: "No img",
            gsx$title: "No title",
            gsx$text: "No text",
        },
    });

    var Library = Backbone.Collection.extend({
        model: Cage,
        url: function () {
            var key = "1RdZC_N9j_wxLX-GyqAIC4fbWtprIzuc-qDDtxdQ3Ujw";
            return "https://spreadsheets.google.com/feeds/list/" + key + "/od6/public/values?alt=json";
        },
        parse: function (resp, xhr) {
            var data = resp.feed.entry, i;
            console.log(data.length);
            console.log(data);
            for (i = data.length - 1; i >= 0; i--) {
                data[i].id = data[i].id['$t'];
                data[i]['gsx$imghref'] = data[i]['gsx$imghref']['$t'];
                data[i]['gsx$title'] = data[i]['gsx$title']['$t'];
                data[i]['gsx$text'] = data[i]['gsx$text']['$t'];
            }
            return data;
        }
    });

    var BookView = Backbone.View.extend({
        tagName: "div",
        className: "cageContainer",
        template: $("#CageTemplate").html(),
        render: function () {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },
    });
    var LibraryView = Backbone.View.extend({
        el: $("#cages"),

        initialize: function () {
            this.collection = new Library();
            this.collection.fetch({
                error: function () {
                    console.log(arguments);
                }
            });
            console.log(this);
            this.render();
            this.collection.on("reset", this.render, this);
        },

        render: function () {
            var that = this;
            _.each(this.collection.models, function (item) {
                that.renderCage(item);
            });
        },

        renderCage: function (item) {
            var bookView = new BookView({
                model: item
            });
            this.$el.append(bookView.render().el);
        }
    });

    var libraryView = new LibraryView();

})(jQuery);