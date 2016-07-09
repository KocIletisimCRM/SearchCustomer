/// <reference path="crmApi.js" />
/// <reference path="knockout-3.4.0.js" />

$(document).ready(function () {
    crmAPI.userInfo(function (a, b, c) {
        if (a != null && a.userId != 0 && dataModel && dataModel.renderBindings) {
            ko.cleanNode("ModalContainer");
            dataModel.renderBindings();
        }
    }, null, null);
});

var dataModel = {
    taskqueuelist: ko.observableArray([]),
    user: ko.observable(),
    selectedCustomer: ko.observable(),
    ara: function () {
        var self = this;
        $("#bilgi").hide();
        if ($("#smno").val().replace(/ /g, '').length < 4) {
            $("#uyari").show();
        }
        else {
            $("#uyari").hide();
            var data = {
                pageNo: 1,
                rowsPerPage: 100,
                superonline: { fieldName: 'superonlineCustNo', op: 2, value: $("#smno").val() },
            };
            crmAPI.getTaskqueuesForBayi(data, function (a, b, c) {
                self.taskqueuelist(a.data.rows);
                if (self.taskqueuelist().length == 0)
                    $("#bilgi").show();
                $(".customer").click(function () {
                    self.selectedCustomer(self.taskqueuelist()[0].attachedcustomer);
                });
            }, null, null);
        }
    },
    getUser: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
        }, null, null);
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.ara();
        }
        return true;
    },
    renderBindings: function () {
        var self = this;
        self.getUser();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
};

$("#ara").click(function () {
    dataModel.ara();
});
$("#exit").click(function () {
    document.cookie = "token=;";
    crmAPI.setCookie("tqlFilter", "");
    window.location.href = "index.html";

});
$("#uyari").hide();