<?php

namespace Tests\Feature;

use Tests\TestCase;

class TagsPageTest extends TestCase
{
    public function test_tags_index_en_is_not_found(): void
    {
        $response = $this->get('/tags');

        $response->assertStatus(404);
    }

    public function test_tags_index_pt_br_is_not_found(): void
    {
        $response = $this->get('/pt-BR/tags');

        $response->assertStatus(404);
    }

    public function test_tag_show_en_is_not_found(): void
    {
        $response = $this->get('/tags/some-slug');

        $response->assertStatus(404);
    }

    public function test_tag_show_pt_br_is_not_found(): void
    {
        $response = $this->get('/pt-BR/tags/some-slug');

        $response->assertStatus(404);
    }
}
