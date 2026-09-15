<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->query('category');
        $query = Article::latest('published_at');

        if ($category && $category !== 'All') {
            $query->where('category', $category);
        }

        $articles = $query->paginate(9)->withQueryString();
        $categories = ['All', 'Patch Notes', 'Announcements', 'Engineering', 'Community'];

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'selectedCategory' => $category ?? 'All',
        ]);
    }

    public function show(string $slug): Response
    {
        $article = Article::where('slug', $slug)->firstOrFail();
        $relatedArticles = Article::where('id', '!=', $article->id)->latest()->take(3)->get();

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
