<?php

namespace VisualComposer\Modules\Editors\Elements\AjaxShortcodeRender;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Http\Request;
use VisualComposer\Helpers\WordPress\Actions;
use VisualComposer\Modules\System\Container;

class AjaxShortcodeRenderController extends Container
{

    public function __construct(Dispatcher $event)
    {
        Actions::add('wp_ajax_vc:v:ajaxShortcodeRender', function () {
            $this->call('ajaxShortcodeRender');
        });

        $event->listen('vc:v:ajaxShortcodeRender:getVersion', function() {
            return $this->getVersion();
        });
    }

    private function ajaxShortcodeRender(Request $request)
    {
        // @todo add _nonce, check access
        $content = do_shortcode($request->get('shortcodeString'));
        wp_print_head_scripts();
        wp_print_footer_scripts();
        die($content);
    }

    public function getVersion() {
        return 'hello';
    }
}